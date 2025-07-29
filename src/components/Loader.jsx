export default function Loader() {
  return (
    <div className="fixed inset-0 bg-rgb(44, 44, 44) flex items-center justify-center z-50">
      <div className="loader" style={{ width: '30vw' }}>
        <div className="light"></div>
        <div className="black_overlay"></div>
      </div>
    </div>
  );
}
