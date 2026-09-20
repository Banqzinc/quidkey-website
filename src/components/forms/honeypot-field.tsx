import { useId } from 'react'

// Anti-spam trap shared by every public form. It stays in the DOM because bots
// that parse markup fill every input, but it is visually hidden, out of the tab
// order, and labelled so a screen-reader user who lands on it knows to leave it.
export function HoneypotField({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const id = useId()
  return (
    <div className="sr-only">
      <label htmlFor={id}>Leave this field empty</label>
      <input
        id={id}
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}
