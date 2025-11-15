interface WordButtonProps {
  color: string;
  clickHandler: () => void;
  word: string;
}

export default function WordButton({ color, clickHandler, word }: WordButtonProps) {
  return (
    <button className={`list-none border px-2 py-1 rounded-full ${color}`} onClick={clickHandler}>
      {word}
    </button>
  )
}
