// store/userProfileStore.js
import {create} from 'zustand'

const useProfileStore = create((set) => ({
  userType:'',
  email:'',
  password:'',

  // Auth State
  accessToken: null,
  
  // User Profile Fields
  username: '',
  displayname: '',
  description: '',
  location: '',
  
  // Image States
  profileImage: null,
  coverImage: null,
  additionalPhotos: [],
  
  // Additional States
  selectedGenres: [],
  userType: '',
  isLoading: false,
  error: null,
  
  // Single update field action
  updateField: (field, value) => set({
    [field]: value
  }),
  
  // Reset store action
  resetStore: () => set({
    userType:'',
    email:'',
    password:'',
    accessToken: null,
    username: '',
    displayname: '',
    description: '',
    location: '',
    profileImage: null,
    coverImage: null,
    additionalPhotos: [],
    selectedGenres: [],
    userType: '',
    error: null,
    isLoading: false
  })
}))

export default useProfileStore