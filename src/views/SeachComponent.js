import React from "react";
import { Form, Button, Col } from "react-bootstrap";

const SeachComponent = () => {
  const [searchResult, setSearchResult] = React.useState([]);
  const inputRef = React.useRef();

  const handleButtonCick = async () => {
    const url = process.env.REACT_APP_API_URL;

    const { value } = inputRef.current;

    const query = `query SearchQuery($searchString: String!){
      search(searchString: $searchString){
        street
        firstName
          lastName
          city
          state
          zip
          rent
          id
      }
    }`;

    if (value?.length !== 0) {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query,
          variables: {
            searchString: value,
          },
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response?.data) {
            const { search } = response?.data;
            setSearchResult(search);
          }

          inputRef.current.value = "";
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const renderObjectValue = (val) => {
    return val !== null ? `${val},` : ""
  }

  const renderList = () => {

    return searchResult?.length !== 0 ? (
      <div className="list-container">
          {searchResult?.map((result, index) => {
              return (
              <div className="list-item" key={index}>
                {
                  result?.firstName !== null && result?.lastName && (
                    <h5 className="font-bold">{`${result?.firstName} ${result?.lastName}`}</h5>
                  )
                }
                <h6 className="font-italic">{result?.rent !== null ? `P ${(result?.rent).toLocaleString('US')}` : null}</h6>
                <h6>{`
                ${renderObjectValue(result?.street)} 
                ${renderObjectValue(result?.city)}
                ${renderObjectValue(result?.state)}
                ${renderObjectValue(result?.zip)}`}
                </h6>
              </div>
              );
            })}
        </div>
    ) : null
  }

  return (
    <div className="container">
      <div className="search-container">
        <Col xs="6">
          <Form.Group className="mb-3 search-form">
            <Form.Control type="text" ref={inputRef} placeholder="" />
            <Button
              className="ml-2 btn btn-primary"
              onClick={() => handleButtonCick()}
            >
              Submit
            </Button>
          </Form.Group>
        </Col>
      </div>

      <div className="search-results--container">
        {renderList()}
      </div>
    </div>
  );
};

export default SeachComponent;
