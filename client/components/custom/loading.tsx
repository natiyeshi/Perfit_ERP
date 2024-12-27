export default function Loading({ className }: { className: string }) {
  return (
    <div className={`spinner ${className}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
