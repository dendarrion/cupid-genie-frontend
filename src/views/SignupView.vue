<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import { useMutation } from '@vue/apollo-composable';
import CREATE_USER from '@/graphql/mutations/create_user.gql'
const router = useRouter()
const form = ref({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  password: '',
  dateOfBirth: '',
  gender: '',
  genderInterest: [],
  country: '',
  region: '',
  city: '',
  bio: '',
  gallery: [],
})
const galleryPreviews = ref([])
const errors = ref([])

const { mutate: createUser, loading } = useMutation(CREATE_USER)
const handleGalleryUpload = (e) => {
  const files = Array.from(e.target.files).slice(0, 5);
  form.value.gallery = files;
  galleryPreviews.value = files.map(f => URL.createObjectURL(f));
}
const handleSignup = async () => {
  errors.value = [];
  console.log(form.value);
  
  try {
    const input = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      phone: form.value.phone,
      email: form.value.email,
      password: form.value.password,
      dateOfBirth: form.value.dateOfBirth,
      gender: form.value.gender,
      genderInterest: form.value.genderInterest,
      country: form.value.country,
      region: form.value.region,
      city: form.value.city,
      bio: form.value.bio,
      gallery: form.value.gallery
    };

    const response = await createUser({ input: form.value });

    const data = response.data.createUser;
    if (data.errors.length) {
      errors.value = data.errors;
    } else {
      toast('Account created! Check your email for activation.', {
        theme: 'auto',
        type: 'success',
        position: 'bottom-center'
      });
      router.push('/login');
    }
  } catch (err) {
    errors.value = [err.message];
    console.error(err);
  }
}
</script>
<template>
  <main class="flex justify-center items-center min-h-screen px-4 bg-gray-50 dark:bg-gray-900 pb-20">
    <form @submit.prevent="handleSignup" class="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-white">Sign Up</h2>

      <ul v-if="errors.length" class="mb-4 text-red-500 text-sm">
        <li v-for="(err, i) in errors" :key="i">{{ err }}</li>
      </ul>

      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">First Name</label>
        <input data-testid="first-name-input" v-model="form.firstName" class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white" />
      </div>

      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Last Name</label>
        <input data-testid="last-name-input" v-model="form.lastName" class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white" />
      </div>

      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Phone</label>
        <input data-testid="phone-input" v-model="form.phone" type="tel" class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white" />
      </div>

      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
        <input data-testid="signup-email-input" v-model="form.email" type="email" class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white" />
      </div>

      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Password</label>
        <input data-testid="signup-password-input" v-model="form.password" type="password" class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white" />
      </div>

      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Date of Birth</label>
        <input data-testid="date-of-birth-input" v-model="form.dateOfBirth" type="date" class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white" />
      </div>

      <div class="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Gender</label>
          <select data-testid="gender-input" v-model="form.gender" class="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white">
            <option disabled value="">Select</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="NONBINARY">Non-binary</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Gender Interest</label>
          <select multiple data-testid="gender-interest-input" v-model="form.genderInterest" class="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white">
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="NONBINARY">Non-binary</option>
          </select>
        </div>
      </div>

      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Location</label>
        <input data-testid="country-input" v-model="form.country" placeholder="Country" class="w-full p-2 border rounded-md mb-2 dark:bg-gray-700 dark:text-white" />
        <input data-testid="region-input" v-model="form.region" placeholder="State/Region" class="w-full p-2 border rounded-md mb-2 dark:bg-gray-700 dark:text-white" />
        <input data-testid="city-input" v-model="form.city" placeholder="City" class="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white" />
      </div>

      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Bio</label>
        <textarea data-testid="bio-input" v-model="form.bio" class="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"></textarea>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Gallery (1-5 images)</label>
        <input data-testid="gallery-input" type="file" multiple accept="image/*" @change="handleGalleryUpload" class="w-full text-sm text-gray-600 dark:text-gray-300 mb-2" />
        <div class="flex gap-2 flex-wrap">
          <img v-for="(img, i) in galleryPreviews" :key="i" :src="img" class="w-20 h-20 object-cover rounded border" />
        </div>
      </div>

      <button data-testid="signup-submit-btn" type="submit" :disabled="loading" class="w-full p-2 bg-pink-600 hover:bg-pink-500 text-white rounded-md transition-colors">
        Sign Up
      </button>
    </form>
  </main>
</template>