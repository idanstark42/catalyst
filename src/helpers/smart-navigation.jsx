import { useNavigate as useBasicNavigate } from 'react-router-dom'

export default function useNavigate () {
  const navigate = useBasicNavigate()
  return path => navigate(path + window.location.search)
}