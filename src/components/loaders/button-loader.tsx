export default function ButtonLoader(props: any) {
  return <div className={props.loading ? "loader" : ""}>{props.children}</div>;
}
