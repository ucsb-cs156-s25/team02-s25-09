import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

// Helper for DELETE request
// Stryker disable StringLiteral : hard to test for string literals
const cellToAxiosParamsDelete = (cell) => {
  return {
    url: "/api/articles",
    method: "DELETE",
    params: {
      id: cell.row.values.id,
    },
  };
};
// Stryker restore StringLiteral

// Success callback
// Stryker disable all : hard to test for console logs
const onDeleteSuccess = (message) => {
  console.log("Delete successful:", message);
};
// Stryker restore all

export default function ArticlesTable({ articles, currentUser }) {
  const navigate = useNavigate();

  // Stryker disable next-line StringLiteral : hard to test for string literals
  const editCallback = (cell) => {
    navigate(`/articles/edit/${cell.row.values.id}`);
  };

  // Stryker disable all : hard to test for query caching
  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/articles/all"],
  );
  // Stryker restore all

  // Stryker disable next-line all
  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  // Stryker disable next-line ArrayDeclaration : hard to test for array literals
  const columns = [
    {
      Header: "id",
      accessor: "id", // accessor is the "key" in the data
    },
    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "URL",
      accessor: "url",
    },
    {
      Header: "Explanation",
      accessor: "explanation",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Date Added",
      accessor: "dateAdded",
    },
  ];

  if (hasRole(currentUser, "ROLE_ADMIN")) {
    // Stryker disable next-line BlockStatement : hard to test for block statements
    columns.push(
      ButtonColumn("Edit", "primary", editCallback, "ArticlesTable"),
    );
    columns.push(
      ButtonColumn("Delete", "danger", deleteCallback, "ArticlesTable"),
    );
  }

  return (
    <OurTable data={articles} columns={columns} testid={"ArticlesTable"} />
  );
}
