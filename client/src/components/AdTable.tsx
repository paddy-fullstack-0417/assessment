import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  Grow,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { styled, useTheme } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { Product } from "../utils/interfaces";
import { formatDate } from "../utils/functions";
import { useDispatch } from "react-redux";
import { updateAddData } from "@/store/results.action";
import Swal from "sweetalert2";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.secondary.main,
  },
  "&:hover": {
    cursor: "pointer",
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function AdTable(props: any) {
  const { data } = props;

  const dispatch = useDispatch();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<any>({
    id: "",
    Allowed_Spend_per_Ad: [],
    Cost_Share_Rate: 0,
    spend: {},
    price: 0,
  });

  const handleEditDialogOpen = (ad_data: any) => {
    setSelectedAd(ad_data);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const updateData = () => {
    dispatch(updateAddData(selectedAd)).then((response: any) => {
      if (!response.success) {
        Swal.fire({
          icon: "error",
          position: "top-right",
          toast: true,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          text: response.message,
        });
      }

      handleEditDialogClose();
    });
  };

  const calculateSpend = (spend: any) => {
    let totalSpend = 0;
    for (const key in spend) {
      totalSpend += spend[key];
    }
    return totalSpend;
  };

  const calculateReimbursement = (spend: any, costSharing: number) => {
    let totalSpend = 0;
    for (const key in spend) {
      totalSpend += spend[key];
    }
    return totalSpend * costSharing;
  };
  return (
    <>
      <Grow in={true}>
        <TableContainer component={Paper} className="relative mb-12 container">
          <Table className="shadow-md rounded-md">
            <TableHead>
              <TableRow>
                <StyledTableCell>Ad_Type</StyledTableCell>
                <StyledTableCell>Spend</StyledTableCell>
                <StyledTableCell>Cost_Sharing</StyledTableCell>
                <StyledTableCell>Reimbursement</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.length > 0 ? (
                data.map((ads_data: any, index: number) => (
                  <StyledTableRow key={ads_data.id}>
                    <StyledTableCell>{ads_data.id}</StyledTableCell>
                    <StyledTableCell>
                      ${calculateSpend(ads_data.spend)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {ads_data.Cost_Share_Rate}
                    </StyledTableCell>
                    <StyledTableCell>
                      $
                      {calculateReimbursement(
                        ads_data.spend,
                        ads_data.Cost_Share_Rate
                      ).toFixed(2)}
                    </StyledTableCell>
                    <StyledTableCell>
                      <IconButton
                        onClick={() => handleEditDialogOpen(ads_data)}
                      >
                        <EditIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <TableCell colSpan={6}>
                    <h1 className="w-full text-3xl text-center p-4">
                      No matching data
                    </h1>
                  </TableCell>
                </StyledTableRow>
              )}
            </TableBody>

            <TableFooter></TableFooter>
          </Table>
        </TableContainer>
      </Grow>

      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Add AD</DialogTitle>

        <DialogContent className="flex flex-col w-96">
          <Typography>
            Allowed Spend {selectedAd.Allowed_Spend_per_Ad.length ? `$${selectedAd.Allowed_Spend_per_Ad[0]} ~ $${selectedAd.Allowed_Spend_per_Ad[1]}` : `$${selectedAd.Allowed_Spend_per_Ad}`}
          </Typography>
          <TextField
            label="AD TYPE"
            variant="outlined"
            className="my-2"
            value={selectedAd.id}
          />

          <TextField
            label="Price"
            type="number"
            variant="outlined"
            className="my-2"
            onChange={({ target: { value } }) =>
              setSelectedAd({ ...selectedAd, price: Number(value) })
            }
          />

          <Button
            color="primary"
            variant="contained"
            className="font-bold text-lg h-12 my-4 bg-gray-700"
            onClick={updateData}
          >
            ADD
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
