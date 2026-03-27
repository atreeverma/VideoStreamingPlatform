function Button({ type = "button",onClick, children }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      {children}
    </button>
  );
}

export default Button;