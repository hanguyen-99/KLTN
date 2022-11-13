import moment from "moment";
import { ColumnFilter } from "./ColumnFilter";

export const COLUMN_ACOUNT = [
  {
    Header: "Id",
    accessor: "id",
  },
  {
    Header: "User code",
    accessor: "userCode",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "First Name",
    accessor: "firstName",
  },
  {
    Header: "Last Name",
    accessor: "lastName",
  },
  {
    Header: "Date of Birth",
    accessor: "dob",
    Cell:({value}) =>{ return moment(value).format('YYYY-MM-DD')}
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Phone",
    accessor: "phoneNumber",
  },
  {
    Header: "Status",
    accessor: "isActive",
    Cell:({value}) =>{ 
      if(value){
        return <div className="bg-green-400 rounded-xl text-white py-1">Active</div>
      }
      return <div className="bg-red-600 rounded-xl text-white py-1">In Active</div>
    }
  },
];
