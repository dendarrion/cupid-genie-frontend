import { computed, ref } from "vue"

const threshold = 120

const x = ref(0)
const y = ref(0)
const startX = ref(0)
const startY = ref(0)
const dragging = ref(false)

export function dragEvents({ emit, object, index }) {

    let hasEmitted = false

    const startDrag = (event) => {
        event.preventDefault()
        hasEmitted = false
        const mouseX = event.clientX || event.touches[0].clientX
        const mouseY = event.clientY || event.touches[0].clientY
    
        startX.value = mouseX - x.value
        startY.value = mouseY - y.value
        dragging.value = true
    
        document.addEventListener('mousemove', onDrag)
        document.addEventListener('touchmove', onDrag)
        document.addEventListener('mouseup', stopDrag)
        document.addEventListener('touchend', stopDrag)
    }
    
    const onDrag = (event) => {
        const mouseX = event.clientX || event.touches[0].clientX
        const mouseY = event.clientY || event.touches[0].clientY
    
        x.value = mouseX - startX.value
        y.value = mouseY - startY.value
    }
    
    const stopDrag = () => {
        document.removeEventListener('mousemove', onDrag)
        document.removeEventListener('touchmove', onDrag)
        document.removeEventListener('mouseup', stopDrag)
        document.removeEventListener('touchend', stopDrag)

        let direction = null
        if (x.value > threshold)  direction = 'right'
        else if (x.value < -threshold) direction = 'left'

        
        
        if (direction && !hasEmitted) {
            hasEmitted = true
            console.log(`Emitting swipe ${direction} for ${object?.value?.fullName}`);
            emit('swipe', direction, object?.value)
        }

        x.value = 0
        y.value = 0
        dragging.value = false
    }

    const cardStyle = computed(() => {
        const base = {
            ...(object?.value?.profilePicture
                ? { backgroundImage: `url("${object.value.profilePicture}")` }
                : {}),
            transition: dragging.value ? 'none' : 'transform 0.3s ease',
            zIndex: 50 - index.value,
        }

        if (index.value === 0) {
            return {
                ...base,
                transform: `translate(${x.value}px, ${y.value}px) rotate(${x.value * 0.05}deg)`,
            }
        }
        if (index.value === 1) {
            return {
                ...base,
                pointerEvents: 'none',
                transform: `scale(0.95) translateY(10px) rotate(6deg)`,
            }
        } else if (index.value === 2) {
            return {
                ...base,
                pointerEvents: 'none',
                transform: `scale(0.94) translateY(20px) rotate(12deg)`,
            }
        } else {
            return { 
                ...base,
                pointerEvents: 'none',
                transform: `scale(0.9) translateY(40px) rotate(${index.value * 6}deg)`,
            }
        }
    })

    return {
        startDrag,
        onDrag,
        stopDrag,
        cardStyle,
    }
}
