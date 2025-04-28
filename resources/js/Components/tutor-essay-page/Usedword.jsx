export default function UsedWord({number, className, clickHandler, hasComment, word}) {

  return(
    <li 
      key={number} 
      className={`list-none border px-2 py-1 text-sm rounded-full cursor-pointer ${className}`}
      onClick={clickHandler}
      >
      {word.word}
      {hasComment && <span className="ml-1">💬</span>}
    </li>
  )
}