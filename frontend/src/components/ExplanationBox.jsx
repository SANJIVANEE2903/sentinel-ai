export default function ExplanationBox({ explanation }) {
  return (
    <div className="p-4 bg-gray-100 rounded-lg">

      <h3 className="font-bold mb-2">🧠 Why this result?</h3>

      <ul className="list-disc pl-5 text-sm">
        {explanation.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

    </div>
  );
}