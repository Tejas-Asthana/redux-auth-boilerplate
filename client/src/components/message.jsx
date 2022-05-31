export default function Msg({ id, sender, text }) {
  return <div className={id == sender ? "msg-slf" : "msg-new"}>{text}</div>;
}
