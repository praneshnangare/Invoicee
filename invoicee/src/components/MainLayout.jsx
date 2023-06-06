import React from "react";
import Menu from "./Menu";
import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";

const MainLayout = ({ rightComponent }) => {
  const theme = useTheme();
  const isBrowser = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100vw"
    >
      <Box style={{ flex: 1 }}>
        <Grid container sx={{ mt: { xs: -5, md: -12 }, flex: 1 }}>
          {isBrowser && (
            <Grid item md={4} xl={3} sx={{ pl: 5, pr: 5 }}>
              <Menu />
            </Grid>
          )}
          <Grid
            item
            xs={12}
            md={8}
            xl={9}
            sx={{
              pr: { xs: 2, md: 5 },
              ml: { xs: 2, md: 0 },
            }}
          >
            <Grid item container xs={12}>
              {rightComponent ? (
                <Grid item xs={12}>
                  {rightComponent}
                </Grid>
              ) : (
                <Grid item xs={12} sx={{ pb: 4 }}>
                  {" "}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default MainLayout;
