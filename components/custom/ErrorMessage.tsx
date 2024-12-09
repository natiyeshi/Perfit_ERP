const ErrorMessage = ({
  message,
  topic,
}: {
  message: string;
  topic: string;
}) => {
  return (
    <div className="w-2/3 mt-4 ms-4 rounded px-2 py-3 flex flex-col gap-2 bg-orange-700 text-gray-300">
      <div className="text-white font-semibold text-lg">{topic}</div>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
