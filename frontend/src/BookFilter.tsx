import { useEffect, useState } from 'react'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? 'http://localhost:5021' : '')

function BookFilter({
  selectedCategories,
  onCheckboxChange,
}: {
  selectedCategories: string[]
  onCheckboxChange: (selectedCategories: string[]) => void
}) {
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Books/GetBookTypes`)
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching book categories:', error)
      }
    }

    fetchCategories()
  }, [])

  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    const updatedCategories = selectedCategories.includes(target.value)
      ? selectedCategories.filter((c) => c !== target.value)
      : [...selectedCategories, target.value]

    onCheckboxChange(updatedCategories)
  }

  return (
    <div className="card shadow-sm sticky-top summary-card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 mb-0">Categories</h2>
          <span className="badge rounded-pill text-bg-secondary">
            {selectedCategories.length}
          </span>
        </div>

        <button
          className="btn btn-outline-secondary btn-sm mb-3"
          onClick={() => onCheckboxChange([])}
          disabled={selectedCategories.length === 0}
        >
          Clear Filters
        </button>

        <div className="vstack gap-2">
          {categories.map((c) => (
            <div className="form-check" key={c}>
              <input
                type="checkbox"
                id={c}
                value={c}
                className="form-check-input"
                checked={selectedCategories.includes(c)}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor={c}>
                {c}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BookFilter
