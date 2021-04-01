import { useState, useCallback } from "react";
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  NavbarBrand,
  Table,
  Badge,
} from "reactstrap";
import { Link, useHistory } from "react-router-dom";
import { useEffect } from "react";

const Detail = ({ tagState, setTagState, tags }) => {
  const history = useHistory();
  const item = history.location.state;
  const [input, setInput] = useState("");

  let active = [];
  let inactive = [...tags];
  try {
    const state = tagState[item.index];
    if (state) {
      active = state;
      for (const a of active) {
        var index = inactive.indexOf(a);
        if (index !== -1) {
          inactive.splice(index, 1);
        }
      }
    }
  } catch (err) {}

  const onActive = (tag) => {
    setTagState({
      ...tagState,
      [item.index]: [...active, tag],
    });
  };

  const onInactive = (tag) => {
    let newActive = active.filter((i) => i !== tag);
    setTagState({
      ...tagState,
      [item.index]: newActive,
    });
  };

  const handleKey = useCallback(
    (e) => {
      if (e.keyCode === 13) {
        if (input.length > 0) {
          onActive(input);
        }
        return setInput("");
      } else if (e.keyCode === 0) {
        return setInput("");
      } else if (e.keyCode === 8) {
        console.log(input.slice(0, -1));
        return setInput(input.slice(0, -1));
      } else {
        setInput(`${input}${e.key}`);
      }
    },
    [input]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [input]);

  return (
    <div className="Container">
      <Navbar color="light" light expand="md">
        <Nav className="mr-auto" navbar>
          <NavbarBrand>Report Text Detail</NavbarBrand>
          <NavItem>
            <NavLink tag={Link} to="/">
              <i className="fas fa-chevron-left" />
              &nbsp;Back
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
      <Table responsive>
        <thead>
          <tr>
            <th>Report Text</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{item.text}</td>
            <td style={{ width: 500 }}>
              <p style={{ fontStyle: "italic", color: "red" }}>
                Click tag to active/inactive
              </p>
              <p>
                Active Tags:&nbsp;&nbsp;
                {active.map((item) => (
                  <Badge
                    color="success"
                    pill
                    className="margin"
                    onClick={() => onInactive(item)}
                    key={item}
                  >
                    #{item}
                  </Badge>
                ))}
              </p>

              <p>
                Inactive Tags:&nbsp;&nbsp;
                {inactive.map((item) => (
                  <Badge
                    color="danger"
                    pill
                    className="margin"
                    onClick={() => onActive(item)}
                    key={item}
                  >
                    #{item}
                  </Badge>
                ))}
              </p>
              <p />
              <p style={{ fontStyle: "italic", color: "red" }}>
                Type to add tag, enter to complete, escape to stop typing
              </p>
              <p>{input}</p>
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default Detail;
