import { useCallback, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import List from "./View/List";
import Detail from "./View/Detail";
import debounce from "./util/debounce";
import "./App.css";
import { getParagraphs } from "./data";

const limit = 10;
const tags = ["tag1", "tag2", "tag3", "tag4", "tag5"];

function App() {
  const [tagState, setTagState] = useState({});
  const [paragraphs, setParagraphs] = useState({
    total: 0,
    data: [],
    page: 0,
    isLoading: true,
  });
  const [search, setSearch] = useState("");

  const filter = useCallback(
    debounce((search) => {
      getParagraphs({ page: 0, limit, search }).then((response) =>
        setParagraphs({ ...response, page: 0 })
      );
    }, 500),
    []
  );

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/detail">
            <Detail tags={tags} tagState={tagState} setTagState={setTagState} />
          </Route>
          <Route path="/">
            <List
              paragraphs={paragraphs}
              setParagraphs={setParagraphs}
              search={search}
              setSearch={setSearch}
              limit={limit}
              filter={filter}
              tagState={tagState}
              setTagState={setTagState}
              tags={tags}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
