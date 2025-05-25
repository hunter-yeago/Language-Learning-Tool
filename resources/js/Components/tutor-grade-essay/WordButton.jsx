export default function WordButton({ color, clickHandler, word }) {
  return (
    <button className={`list-none border px-2 py-1 rounded-full ${color}`} onClick={clickHandler}>
      {word}
    </button>
  )
}
