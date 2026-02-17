import { Link } from "react-router-dom";

interface HeadingProps {
  href: string;
  text: string;
}

function Heading(props: HeadingProps) {
  return (
    <div>
      <h1>
        <Link
          style={{
            textDecoration: "none",
            color: "#635e5e",
          }}
          to={props.href}
        >
          {props.text}
        </Link>
      </h1>
      <hr />
    </div>
  );
}

export default Heading;
