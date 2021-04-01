import { useEffect } from "react";
import {
  Table,
  Input,
  Navbar,
  Nav,
  NavbarBrand,
  ButtonGroup,
  Button,
  Badge,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { getParagraphs } from "../data";

const ItemTypes = {
  TAG: "tag",
};

const DragableBadge = ({ item }) => {
  const [, drag] = useDrag({
    type: ItemTypes.TAG,
    item: { tag: item },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  return (
    <div
      ref={drag}
      style={{
        fontSize: 18,
        fontWeight: "bold",
        cursor: "move",
      }}
    >
      <Badge color="secondary" pill className="margin" key={item}>
        #{item}
      </Badge>
    </div>
  );
};

const Row = ({ item, onClick, activeTag, setTagState, tagState }) => {
  const [, drop] = useDrop(
    {
      accept: ItemTypes.TAG,
      drop: ({ tag }) => {
        setTagState({
          ...tagState,
          [item.index]: [...new Set([...activeTag, tag])],
        });
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    },
    [activeTag, tagState]
  );

  const onInactive = (tag) => {
    let newActive = activeTag.filter((i) => i !== tag);
    setTagState({
      ...tagState,
      [item.index]: newActive,
    });
  };

  return (
    <tr
      ref={drop}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <th scope="row">{item.index}</th>
      <td>
        {activeTag.map((item) => (
          <Badge
            color="success"
            pill
            className="margin"
            key={item}
            onClick={() => onInactive(item)}
          >
            #{item}
          </Badge>
        ))}
        {item.text}
      </td>
      <td>
        <Button onClick={onClick} color="link">
          <i className="fas fa-chevron-right" style={{ color: "#7c7c7d" }} />
        </Button>
      </td>
    </tr>
  );
};

const List = ({
  search,
  setSearch,
  filter,
  paragraphs,
  limit,
  setParagraphs,
  tagState,
  setTagState,
  tags,
}) => {
  const history = useHistory();

  useEffect(() => {
    setParagraphs({ ...paragraphs, isLoading: true });
    getParagraphs({ page: 0, limit, search }).then((response) =>
      setParagraphs({ ...response, isLoading: false, page: 0 })
    );
  }, []);

  return (
    <div className="Container">
      <DndProvider backend={HTML5Backend}>
        <Navbar color="light" light>
          <NavbarBrand href="/">Segmed</NavbarBrand>
          <Nav className="mr-auto" navbar>
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                filter(e.target.value);
              }}
            />
          </Nav>
          <Nav className="mr-auto" navbar>
            <span style={{ color: "red" }}>
              Prepend "-" to perform exclude search. Drag n Drop Tag for
              Tagging, Click to Tag on List to Remove
            </span>
          </Nav>
          <Nav className="mr-auto" navbar>
            <ButtonGroup className="btn-group">
              {tags.map((item) => (
                <DragableBadge item={item} key={item} />
              ))}
            </ButtonGroup>
          </Nav>

          <ButtonGroup className="btn-group">
            <Button
              disabled={paragraphs.page === 0}
              onClick={() => {
                const page = paragraphs.page - 1;
                setParagraphs({ ...paragraphs, isLoading: true });
                getParagraphs({ page, limit, search }).then((response) =>
                  setParagraphs({ ...response, page, isLoading: false })
                );
              }}
            >
              Prev
            </Button>
            <Button
              disabled={
                paragraphs.page * limit + paragraphs.data.length >=
                paragraphs.total
              }
              onClick={() => {
                const page = paragraphs.page + 1;
                setParagraphs({ ...paragraphs, isLoading: true });
                getParagraphs({ page, limit, search }).then((response) =>
                  setParagraphs({ ...response, page, isLoading: false })
                );
              }}
            >
              Next
            </Button>
          </ButtonGroup>
        </Navbar>

        <Table hover bordered>
          <thead>
            <tr>
              <th>ID</th>
              <th>Report Text</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {paragraphs.data.map((item) => {
              const activeTag = tagState[item.index] || [];

              return (
                <Row
                  key={item.index}
                  item={item}
                  onClick={() => {
                    history.push("/detail", item);
                  }}
                  activeTag={activeTag}
                  tagState={tagState}
                  setTagState={setTagState}
                />
              );
            })}
          </tbody>
        </Table>
      </DndProvider>
    </div>
  );
};
export default List;
