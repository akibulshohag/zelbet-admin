import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import axios from "../../../axios";
import imageBasePath from "../../../config";
import SimpleModal from "../../Shared/SimpleModal/SimpleModal";
import Spinner from "../../Shared/Spinner/Spinner";

export default function ProductList({ addSelectedProducts, existProductIds }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [rows, setRows] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [openImgData, setOpenImgData] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categorySlug, setCategorySlug] = useState("default");
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [allChecked, setAllChecked] = useState(false);
  const [totalChecked, setTotalChecked] = useState(0);

  const columns = [
    {
      id: "checkBox",
      label: (
        <Checkbox
          checked={allChecked}
          onChange={(e) => allCheckedHandler(e.target.checked)}
        />
      ),
      minWidth: 30,
      format: (value) => (
        <Checkbox
          onClick={() => singleCheckHandler(value)}
          checked={value?.isAvoidProduct ? true : value?.checkStatus}
          // checked={value?.checkStatus}
          disabled={value?.isAvoidProduct}
        />
      ),
    },
    {
      id: "sku",
      label: "SKU",
      minWidth: 80,
    },
    {
      id: "image",
      label: "Image",
      minWidth: 100,
      format: (value, name) => (
        <Avatar
          src={imageBasePath + "/" + value}
          alt={name}
          className="border-radius-4"
          style={{ cursor: "pointer", width: "58px" }}
          onClick={() => openImgHandler({ image: value, name: name })}
        />
      ),
    },
    {
      id: "name",
      label: "Title",
      minWidth: 100,
    },
    {
      id: "category",
      label: "Category",
      minWidth: 100,
      format: (value) => {
        return (
          <>
            {value.map((v, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                <Box>
                  <small className="rounded bg-primary elevation-z3 text-white px-2 py-2px m-1">
                    {v?.name}
                  </small>
                </Box>
              </Box>
            ))}
          </>
        );
      },
    },
    { id: "totalSell", label: "Total Sale", minWidth: 80 },
    { id: "purchase", label: "Purchase", minWidth: 80 },
    {
      id: "sale",
      label: "Sale",
      minWidth: 80,
    },
    {
      id: "stock",
      label: "Stock",
      minWidth: 100,
      format: (value) => {
        if (value?.isVariant) {
          return value?.variations.map((variant, idx) => {
            let name = "";
            for (let i = 0; i < variant?.attributeOpts.length; i++) {
              name +=
                variant?.attributeOpts[i].name +
                (variant?.attributeOpts.length - 1 === i ? "" : "-");
            }

            return (
              <React.Fragment key={variant._id}>
                <>
                  {`${name} (${variant?.stock})`}
                  {value?.variations.length - 1 === idx ? "" : <br />}
                </>
              </React.Fragment>
            );
          });
        } else {
          return <>{value?.nonVariation?.stock || 0}</>;
        }
      },
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    let fetchData = async () => {
      try {
        let res = null;
        setIsLoading(true);
        if (categorySlug !== "default") {
          res = await axios.get(
            `/product/all-productby-category/${categorySlug}?page=${
              page + 1
            }&limit=${rowsPerPage}&userType=ADMIN`
          );
        } else if (searchValue !== "") {
          res = await axios.post(
            `product/search-by-sku-or-name?page=${
              page + 1
            }&limit=${rowsPerPage}&userType=ADMIN`,
            { value: searchValue }
          );
        } else {
          res = await axios.get(
            `/product/all-products?page=${
              page + 1
            }&limit=${rowsPerPage}&userType=ADMIN`
          );
        }

        if (res?.data?.data) {
          setTotalData(res?.data?.metaData?.totalData);
          setDataList(
            res?.data?.data.map((i) => {
              return {
                ...i,
                checkStatus: false,
              };
            })
          );
        }
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setErrorMsg(err?.response?.data?.message);
      }
    };

    fetchData();
  }, [page, rowsPerPage, categorySlug, searchValue]);

  useEffect(() => {
    if (dataList.length > 0) {
      let dataArray = [];
      let i = 0;
      for (let data of dataList) {
        let isAvoidProduct = existProductIds.includes(data?._id);

        if (
          data?.checkStatus
          // && !data?.isAvoidProduct
        ) {
          i++;
        }
        dataArray.push({
          _id: data?._id,
          checkBox: {
            checkStatus: data?.checkStatus,
            _id: data?._id,
            isAvoidProduct: isAvoidProduct,
          },
          sku: data?.sku,
          image: data?.galleryImage[0],
          name: data?.name,
          category: data?.categories,
          totalSell: data?.totalSell || 0,
          purchase: data?.purchasePrice,
          sale: data?.sellingPrice,
          stock: {
            isVariant: data?.isVariant,
            variations: data?.variations,
            nonVariation: data?.nonVariation,
          },
          feature: {
            isFeatured: data?.isFeatured,
            _id: data?._id,
          },
          publish: {
            isOwnDisabled: data?.isOwnDisabled,
            _id: data?._id,
          },
          // isPosSuggest: data?.isPosSuggest,
          isPosSuggest: {
            isPosSuggest: data?.isPosSuggest,
            _id: data?._id,
          },
          action: data?.slug,
        });
      }
      if (i === dataList.length) {
        setTotalChecked(i);
        setAllChecked(true);
      } else {
        setTotalChecked(i);
        setAllChecked(false);
      }
      setRows(dataArray);
    } else {
      setRows([]);
    }
  }, [dataList, existProductIds]);

  useEffect(() => {
    let fetchData = async () => {
      try {
        const categoryData = await axios.get("/category/fetch-all");

        let categoryList = [];
        for (let category of categoryData?.data?.data) {
          categoryList.push({
            _id: category?._id,
            name: category?.name,
            slug: category?.slug,
          });
          for (let subCategory of category?.children) {
            categoryList.push({
              _id: subCategory?._id,
              name: "➤ " + subCategory?.name,
              slug: subCategory?.slug,
            });
          }
        }
        setCategoryOptions(categoryList);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const singleCheckHandler = (data) => {
    setDataList(
      dataList.map((i) => {
        return i?._id === data?._id
          ? {
              ...i,
              checkStatus: !data?.checkStatus,
            }
          : i;
      })
    );
  };

  const allCheckedHandler = (checkStatus) => {
    setAllChecked(checkStatus);
    setDataList(
      dataList.map((i) => {
        let isAvoidProduct = existProductIds.includes(i?._id);

        return checkStatus && isAvoidProduct
          ? {
              ...i,
              checkStatus: false,
            }
          : {
              ...i,
              checkStatus: checkStatus,
            };
      })
    );
  };

  const closeModalHandler = () => {
    setIsOpenModal(false);
    setOpenImgData(null);
  };

  const openImgHandler = (data) => {
    setIsOpenModal(true);
    setOpenImgData(data);
  };

  const addToAllSelectedDataHandler = () => {
    let selectedData = dataList.filter((data) => data?.checkStatus);
    addSelectedProducts(selectedData);
    setDataList(
      dataList.map((i) => {
        return {
          ...i,
          checkStatus: false,
        };
      })
    );
  };

  return (
    <div className="elevation-z6">
      <Card className="border-radius-0">
        {/* <CardHeader title="Product List" /> */}
        <div className="w-full overflow-hidden mt-4">
          {totalChecked > 0 ? (
            <Box
              sx={{
                borderBottom: "1px solid #F6F6F6",
                backgroundColor: "#FCF4F2",
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                alignItems: "center",
                py: 1,
                px: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    // backgroundColor: "white",
                    mx: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    className="bg-green text-white"
                    onClick={addToAllSelectedDataHandler}
                  >
                    ADD TO
                  </Button>
                </Box>

                <Typography
                  paragraph
                  className="ml-4 mt-2 min-w-188"
                  style={{ color: "green", fontWeight: "bold" }}
                >{`${totalChecked} product select from this page`}</Typography>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                borderBottom: "1px solid #F6F6F6",
                backgroundColor: "white",
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                alignItems: "center",
                py: 1,
                px: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <TextField
                  label="Filter by Category"
                  size="small"
                  variant="outlined"
                  fullWidth
                  select
                  className="min-w-188"
                  onChange={(e) => {
                    setPage(0);
                    setSearchValue("");
                    setCategorySlug(e.target.value);
                  }}
                  value={categorySlug}
                >
                  <MenuItem value="default">Default</MenuItem>
                  {categoryOptions.map((cat) => (
                    <MenuItem key={cat._id} value={cat?.slug}>
                      {cat?.name}
                    </MenuItem>
                  ))}
                </TextField>
                <Typography
                  paragraph
                  className="ml-4 min-w-188"
                  style={{ color: "green", fontWeight: "bold" }}
                >{`Total Products: ${totalData}`}</Typography>
              </Box>
              <Box>
                <TextField
                  label=""
                  placeholder="Search here.."
                  size="small"
                  variant="outlined"
                  fullWidth
                  className="min-w-240"
                  onChange={(e) => {
                    setPage(0);
                    setCategorySlug("default");
                    setSearchValue(e.target.value);
                  }}
                  value={searchValue}
                />
              </Box>
            </Box>
          )}
        </div>
        <Divider />
      </Card>
      <Card className="border-radius-0">
        {!isLoading ? (
          <div className="w-full overflow-hidden px-2">
            {rows.length > 0 && errorMsg === "" ? (
              <>
                <TableContainer sx={{ maxHeight: 700, minWidth: 400 }}>
                  <Table stickyHeader className="whitespace-pre">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row._id}
                          >
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {column.format
                                    ? column.format(value, row?.name)
                                    : value}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={totalData} // total data
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            ) : (
              <Typography
                variant="body2"
                style={{
                  textAlign: "center",
                  color: "gray",
                  paddingY: "14px",
                  padding: "8px",
                }}
              >
                No Data Found
              </Typography>
            )}
          </div>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              height: "auto",
              width: "auto",
              marginY: "58px",
            }}
          >
            <Spinner />
          </Box>
        )}
      </Card>
      <SimpleModal isShow={isOpenModal} closeModalHandler={closeModalHandler}>
        {openImgData ? (
          <Avatar
            className="border-radius-4"
            style={{ width: "100%", height: "100%" }}
            src={imageBasePath + "/" + openImgData?.image}
            alt={openImgData?.name}
          />
        ) : (
          ""
        )}
      </SimpleModal>
    </div>
  );
}
