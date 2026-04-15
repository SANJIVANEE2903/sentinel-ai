export default function ResultCard({ data }) {
  return (
    <div className="p-5 bg-white shadow rounded-xl border">

      <h2 className="text-xl font-bold">Analysis Result</h2>

      <div
        className={`text-3xl font-bold mt-2 ${
          data.result === "fake" ? "text-red-500" : "text-green-500"
        }`}
      >
        {data.result.toUpperCase()}
      </div>

      <p className="mt-2">
        Confidence: {(data.confidence * 100).toFixed(2)}%
      </p>

    </div>
  );
}