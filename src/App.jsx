import { Routes, Route, Navigate } from 'react-router-dom'
import Wireframe from './spor-app-wireframe'
import Brand from './sporwave-brand-identity'

export default function App() {
  return (
    <Routes>
      <Route path="/wireframe" element={<Wireframe />} />
      <Route path="/brand" element={<Brand />} />
      <Route path="*" element={<Navigate to="/wireframe" replace />} />
    </Routes>
  )
}
