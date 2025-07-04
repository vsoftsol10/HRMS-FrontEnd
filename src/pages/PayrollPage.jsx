import React from "react";
import { useParams } from "react-router-dom";
import PayslipGenerator from "../components/payroll/PaySlipGenerator";

const PayrollPage=()=>{
    const {id}=useParams();
    const payrollID=parseInt(id);

    return(
        <PayslipGenerator
            payrollId={payrollID}
            onClose={()=>window.history.back()}
        />
    )

}
export default PayrollPage;