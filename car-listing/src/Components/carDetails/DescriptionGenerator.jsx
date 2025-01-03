import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateDescription, clearDescription } from "../../Redux/Slicer/Vendor/CarDetails/descriptionSlice";
import styled from "styled-components";

const Container = styled.div`
  padding: 30px;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 150px;
  margin-top: 15px;
  padding: 15px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f6f7f9;
  resize: none;
  color: #333;
  outline: none;

  &:focus {
    border-color: #007bff;
    background-color: #ffffff;
  }
`;

const Button = styled.button`
  background-color: #007bff;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin: 10px 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 15px;
  font-size: 14px;
`;

const DescriptionGenerator = ({ brand, model }) => {
  const dispatch = useDispatch();
  const { description, loading, error } = useSelector((state) => state.description);

  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    if (brand && model && !hasGenerated) {
      dispatch(generateDescription({ brand, model }));
      setHasGenerated(true);
    }
  }, [brand, model, dispatch, hasGenerated]);

  const handleGenerateOrRegenerate = () => {
    dispatch(clearDescription());
    dispatch(generateDescription({ brand, model }));
  };

  return (
    <Container>
      <Title>AI Description Generator</Title>

      <TextArea
        value={description || (loading ? "Generating description..." : "")}
        readOnly
      />

      {error && <ErrorMessage>Error: {error}</ErrorMessage>}

      <div>
        <Button onClick={handleGenerateOrRegenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate/Regenerate"}
        </Button>
      </div>
    </Container>
  );
};

export default DescriptionGenerator;
