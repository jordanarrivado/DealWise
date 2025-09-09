export default function GetCurrentYear() {
  return (
    <span>
      © {new Date().getFullYear()}{" "}
      <span className="font-semibold text-white">DealWise</span>. All rights
      reserved.
    </span>
  );
}
