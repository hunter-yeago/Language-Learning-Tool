export default function WordButton({color, clickHandler, word}) {

  return(
    <button 
      className={`list-none border px-2 py-1 text-sm rounded-full ${color}`}
      onClick={clickHandler}
      >
      {word}
      {/* {hasComment && <span className="ml-1">💬</span>} */}
    </button>
  )
}