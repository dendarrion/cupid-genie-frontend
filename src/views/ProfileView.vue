<script setup>
import { useAuthStore } from '@/stores/auth'
import { ref, watch } from 'vue'

const store = useAuthStore()

const form = ref({
    firstName: store.current_user?.firstName || '',
    lastName: store.current_user?.lastName || '',
    date_of_birth: store.current_user?.dateOfBirth || '',
    gender: store.current_user?.gender || '',
    genderInterest: store.current_user?.genderInterest || '',
    country: store.current_user?.country || '',
    region: store.current_user?.region || '',
    city: store.current_user?.city || '',
    gallery: store.current_user?.gallery || '',
})

console.log(store.current_user.gallery);

const countrySuggestions = ref([])
const regionSuggestions = ref([])
const citySuggestions = ref([])
const galleryPreviews = ref([])

const suggestCountry = ref(false)
const suggestRegion = ref(false)
const suggestCity = ref(false)

let countries = null
let regions = null
let cities = null

const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5)
    galleryPreviews.value = files.map(file => URL.createObjectURL(file))
}

watch(()=>store.current_user?.gallery, (newGallery) => {
    if (Array.isArray(newGallery)) {
        galleryPreviews.value = [...newGallery]
    }
}, { immediate: true })

if (!countries || !regions || !cities) {
  window.setTimeout(async () => {
    const promises = []

    if (!countries) {
      promises.push(import('@/assets/location_data/countries.json').then(module => countries = module.default))
    }
    if (!regions) {
      promises.push(import('@/assets/location_data/states.json').then(module => regions = module.default))
    }
    if (!cities) {
      promises.push(import('@/assets/location_data/cities.json').then(module => cities = module.default))
    }

    await Promise.all(promises)
  }, 0)
}

const onCountryInput = async () => {
    const input = form.value.country.toLowerCase()
    countrySuggestions.value = countries
        .filter(c => c.name.toLowerCase().includes(input))
        .slice(0, 10)
    suggestCountry.value = true
}
const onRegionInput = async() => {
    const selectedCountry = countries.find(c => c.name === form.value.country)
    if (!selectedCountry) return
    const input = form.value.region.toLowerCase()
    regionSuggestions.value = regions
        .filter(s => s.country_id === selectedCountry.id && s.name.toLowerCase().includes(input))
        .slice(0, 10)
    suggestRegion.value = true
}
const onCityInput = async() => {
    const selectedRegion = regions.find(s => s.name === form.value.region)
    if (!selectedRegion) return
    const input = form.value.city.toLowerCase()
    citySuggestions.value = cities
        .filter(c => c.state_id === selectedRegion.id && c.name.toLowerCase().includes(input))
        .slice(0, 10)
    suggestCity.value = true
}

const selectSuggestion = (type, value) => {
    form.value[type] = value
    if (type === 'country') {
        form.value.region = ''
        form.value.city = ''
        regionSuggestions.value = []
        citySuggestions.value = []
    } else if (type === 'region') {
        form.value.city = ''
        citySuggestions.value = []
    }
    hideAllSuggestions()
}
const hideAllSuggestions = () => {
    suggestCountry.value = false
    suggestRegion.value = false
    suggestCity.value = false
}
</script>

<template>
    <div class="max-w-4xl mx-auto p-6">
        <h2 class="text-2xl font-semibold mb-6">Profile</h2>

        <div class="mb-5">
            <h3 class="text-2xl lg:text-xl mb-5">User Information</h3>
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-2">
                <div class="col-span-full lg:col-span-6">
                    <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input v-model="form.firstName" type="text" id="firstName" class="input-field" />
                </div>
                <div class="col-span-full lg:col-span-6">
                    <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input v-model="form.lastName" type="text" id="lastName" class="input-field" />
                </div>
                <div class="col-span-full">
                    <label for="date_of_birth" class="block text-sm font-medium text-gray-700 mb-1">Date of
                        Birth</label>
                    <input v-model="form.date_of_birth" type="date" id="date_of_birth" class="input-field" />
                </div>
                <div class="col-span-full lg:col-span-4">
                    <label for="gender" class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select v-model="form.gender" id="gender" class="input-field">
                        <option disabled value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div class="col-span-full lg:col-span-4">
                    <label for="genderInterest" class="block text-sm font-medium text-gray-700 mb-1">Gender
                        Interest</label>
                    <select v-model="form.genderInterest" id="genderInterest" class="input-field">
                        <option disabled value="">Select genderInterest</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="mb-5">
            <h3 class="text-2xl lg:text-xl mb-5">Location</h3>
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-2">
                <div class="col-span-full lg:col-span-4">
                    <div class="relative">
                        <label for="country" class="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input v-model="form.country" @input="onCountryInput"
                            @blur="() => setTimeout(hideAllSuggestions, 100)" type="text" class="input-field"
                            id="country" placeholder="Country" />
                        <ul v-if="suggestCountry" class="autocomplete-dropdown">
                            <li v-for="(c, i) in countrySuggestions" :key="i" :class="['px-3 py-2 cursor-pointer',
                                    i === activeCountryIndex ? 'bg-pink-500 text-white' : 'hover:bg-pink-100'
                                ]" @click="selectSuggestion('country', c.name)">
                                {{ c.name }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="col-span-full lg:col-span-4">
                    <div class="relative">
                        <label for="" class="block text-sm font-medium text-gray-700 mb-1">Region</label>
                        <input v-model="form.region" @input="onRegionInput"
                            @blur="() => setTimeout(hideAllSuggestions, 100)" type="text" class="input-field" id=""
                            placeholder="State/Region" />
                        <ul v-if="suggestRegion" class="autocomplete-dropdown">
                            <li v-for="(r, i) in regionSuggestions" :key="i"
                                @click="selectSuggestion('region', r.name)">
                                {{ r.name }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="col-span-full lg:col-span-4">
                    <div class="relative">
                        <label for="" class="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input v-model="form.city" @input="onCityInput"
                            @blur="() => setTimeout(hideAllSuggestions, 100)" type="text" class="input-field" id=""
                            placeholder="City" />
                        <ul v-if="suggestCity" class="autocomplete-dropdown">
                            <li v-for="(c, i) in citySuggestions" :key="i" @click="selectSuggestion('city', c.name)">{{
                                c.name }}</li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>

        <div class="mb-5">
            <h4 class="text-2xl lg:text-xl mb-5">Gallery</h4>
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-2">
                <div class="col-span-full">
                    <label for="gallery" class="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
                    <input type="file" multiple accept="image/*" @change="handleGalleryUpload"
                        id="gallery" class="block w-full text-sm text-gray-600" />
                    <p class="text-xs text-gray-500">Minimum 1, maximum 5 images</p>
                    <div class="flex gap-2 flex-wrap">
                        <img v-for="(img, index) in galleryPreviews" :key="index" :src="img"
                            class="w-20 h-20 object-cover rounded border" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>