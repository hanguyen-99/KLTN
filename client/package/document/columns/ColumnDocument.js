import moment from "moment";

export const COLUMN_DOCUMENT = [
  {
    Header: "Id",
    accessor: "documentId",
  },
  {
    Header: "Title",
    accessor: "title",
  },
  {
    Header: "Note",
    accessor: "note",
  },
  {
    Header: "Created At",
    accessor: "createdStamp",
    Cell:({value}) =>{ return moment(value).format('YYYY-MM-DD')}
  },
  {
    Header: "Author",
    accessor: "author",
  }, 
];
