import { colors } from '../../constants/theme';

export default function QuestionBlock({ index, question, value, onChange }) {
  return (
    <div className="question-block">
      <div className="question-text">{index + 1}. {question}</div>
      <input
        value={value || ""}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder="Type your answer…"
      />
    </div>
  );
}
