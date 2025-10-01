import { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Stack,
  Card,
  //   CardActionArea,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import FadeInOnScroll from "./FadeInOnScroll";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const images = [
  "/assets/NewsEvents/screenshot1.jpeg",
  "/assets/NewsEvents/screenshot2.jpeg",
  "/assets/NewsEvents/screenshot3.jpeg",
  "/assets/NewsEvents/webinar1.jpeg", // for event 1
  "/assets/NewsEvents/webinar2.jpeg",
  "/assets/NewsEvents/webinar3.jpeg",
  "/assets/NewsEvents/webinar4.jpeg",
];

export default function NewsEvents() {
  const [expandedEvent, setExpandedEvent] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleToggleExpand = (index) => {
    setExpandedEvent((prev) => (prev === index ? null : index));
  };

  return (
    <FadeInOnScroll>
      <Box sx={{ py: 4, backgroundColor: "#f5f5f5" }} id="news-events">
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
          >
            News & Events
          </Typography>

          <Card
            elevation={3}
            sx={{
              my: 4,
              borderRadius: 3,
              cursor: "pointer",
              overflow: "hidden",
              transition: "all 0.3s ease",
              backgroundColor: "#fff",
            }}
            onClick={() => handleToggleExpand(0)}
          >
            <Box>
              {/* Paragraph 1 - Left, Image 1 - Right */}
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={4}
                alignItems="center"
                justifyContent="center"
                p={isMobile ? 2 : 4}
              >
                <Typography variant="body1" flex={1}>
                  <strong>
                    Inception Workshop Held for “Pakistan Leather Sector:
                    Traceability, Cleaner Production and Circularity” Project on
                    September 24, 2024, at Faletti's Hotel, Lahore.
                  </strong>
                  <br />
                  <br />
                  WWF-Pakistan, in collaboration with its consortium partners
                  and with support from the United Kingdom (UK) International
                  Development through the Sustainable Manufacturing and
                  Environmental Pollution (SMEP) Programme, organized the
                  inception workshop for the Pakistan Leather Sector:
                  Traceability, Cleaner Production and Circularity project. The
                  workshop aimed to align stakeholders on the project’s vision,
                  foster collaboration, and initiate discussions on sustainable
                  practices within Pakistan's leather industry.
                </Typography>
                <Box
                  component="img"
                  src={images[0]}
                  alt="Workshop 1"
                  sx={{
                    width: "100%",
                    maxWidth: isMobile ? "100%" : 600,
                    borderRadius: 2,
                  }}
                />
              </Stack>

              {expandedEvent === 0 && (
                <>
                  {/* Paragraph 2 */}
                  <Stack
                    direction={{ xs: "column", md: "row-reverse" }}
                    spacing={4}
                    alignItems="center"
                    justifyContent="center"
                    px={isMobile ? 2 : 4}
                    pb={isMobile ? 2 : 4}
                  >
                    <Typography variant="body1" flex={1}>
                      Key speakers included representatives from WWF-Pakistan
                      (World Wide Fund for Nature), PCSIR (Pakistan Council of
                      Scientific and Industrial Research), ITU (Information
                      Technology University), PAMCO (Punjab Agriculture & Meat
                      Company), the Sustainable Leather Foundation (SLF), and
                      the Sialkot Chamber of Commerce and Industry (SCCI). The
                      event highlighted the need for digital traceability of
                      hides, cleaner production processes using local
                      innovations, and promoting circularity through waste
                      recycling. The importance of aligning with upcoming
                      European Union (EU) regulations such as the Corporate
                      Sustainability Due Diligence Directive (CSDDD), EU
                      Deforestation Regulation (EUDR), and the Corporate
                      Sustainability Reporting Directive (CSRD) was also
                      emphasized to enhance global market competitiveness.
                    </Typography>
                    <Box
                      component="img"
                      src={images[1]}
                      alt="Workshop 2"
                      sx={{
                        width: "100%",
                        maxWidth: isMobile ? "100%" : 600,
                        borderRadius: 2,
                      }}
                    />
                  </Stack>

                  {/* Paragraph 3 */}
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={4}
                    alignItems="center"
                    justifyContent="center"
                    px={isMobile ? 2 : 4}
                    pb={isMobile ? 2 : 4}
                  >
                    <Typography variant="body1" flex={1}>
                      Participants shared valuable insights during the
                      stakeholder consultation session, informing the
                      development of the digital traceability toolkit. The
                      workshop concluded with a shared commitment to reduce
                      environmental impact and support sustainable leather
                      manufacturing in Pakistan.
                    </Typography>
                    <Box
                      component="img"
                      src={images[2]}
                      alt="Workshop 3"
                      sx={{
                        width: "100%",
                        maxWidth: isMobile ? "90%" : 450,
                        borderRadius: 2,
                      }}
                    />
                  </Stack>
                </>
              )}

              {/* Bottom Indicator Icon */}
              <Box sx={{ textAlign: "center", pb: 2 }}>
                {expandedEvent === 0 ? (
                  <ExpandLessIcon sx={{ color: "#888", fontSize: 32 }} />
                ) : (
                  <ExpandMoreIcon sx={{ color: "#888", fontSize: 32 }} />
                )}
              </Box>
            </Box>
          </Card>

          <Card
            elevation={3}
            sx={{
              my: 4,
              borderRadius: 3,
              cursor: "pointer",
              overflow: "hidden",
              transition: "all 0.3s ease",
              backgroundColor: "#fff",
            }}
            onClick={() => handleToggleExpand(1)}
          >
            <Box>
              {/* Webinar Summary */}
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={4}
                alignItems="center"
                justifyContent="center"
                p={isMobile ? 2 : 4}
              >
                <Typography variant="body1" flex={1}>
                  <strong>
                    Understanding traceability and due diligence in the leather
                    supply chain: Perspectives from Pakistan and Bangladesh
                  </strong>
                  <br />
                  <br />
                  WWF-Pakistan, in collaboration with the United Nations
                  Conference on Trade and Development (UNCTAD), Leather Working
                  Group (LWG), International Trade Center (ITC) and the
                  Sustainable Manufacturing and Environmental Pollution (SMEP)
                  Programme, hosted a webinar on traceability and due diligence
                  in the leather supply chain. The session brought together
                  experts from Pakistan, Bangladesh, and international
                  organizations to explore how the leather sector can prepare
                  for emerging global regulations.
                </Typography>
                <Box
                  component="img"
                  src={images[3]} // replace with correct webinar image
                  alt="Webinar Main"
                  sx={{
                    width: "100%",
                    maxWidth: isMobile ? "100%" : 600,
                    borderRadius: 2,
                  }}
                />
              </Stack>

              {expandedEvent === 1 && (
                <>
                  {/* Webinar Details */}
                  <Stack
                    direction={{ xs: "column", md: "row-reverse" }}
                    spacing={4}
                    alignItems="center"
                    justifyContent="center"
                    px={isMobile ? 2 : 4}
                    pb={isMobile ? 2 : 4}
                  >
                    <Typography variant="body1" flex={1}>
                      The webinar introduced the SMEP Project, funded by UK
                      International Development, which focuses on cleaner
                      production, traceability, and circularity in Pakistan’s
                      leather sector. Speakers from WWF, UNCTAD, LWG, ITC, and
                      Aston University discussed key topics such as the EU
                      Deforestation-Free Regulation (EUDR), sustainability
                      standards, and traceability systems that support
                      responsible sourcing without burdening small producers.
                    </Typography>
                    <Box
                      component="img"
                      src={images[4]} // replace with another webinar image
                      alt="Webinar Detail"
                      sx={{
                        width: "100%",
                        maxWidth: isMobile ? "100%" : 600,
                        borderRadius: 2,
                      }}
                    />
                  </Stack>

                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={4}
                    alignItems="center"
                    justifyContent="center"
                    px={isMobile ? 2 : 4}
                    pb={isMobile ? 2 : 4}
                  >
                    <Typography variant="body1" flex={1}>
                      WWF-Pakistan shared progress on the development of a
                      Digital Traceability Toolkit, which includes hide
                      registration at slaughterhouses, tannery-level
                      traceability, and product tracking across the supply
                      chain. These tools aim to improve transparency and support
                      compliance with international standards. The session also
                      emphasized the importance of building capacity among small
                      and medium enterprises to adopt sustainable practices and
                      stay competitive in the global market.
                    </Typography>
                    <Box
                      component="img"
                      src={images[5]} // replace with another webinar image
                      alt="Webinar Detail 2"
                      sx={{
                        width: "100%",
                        maxWidth: isMobile ? "100%" : 600,
                        borderRadius: 2,
                      }}
                    />
                  </Stack>

                  <Stack
                    direction={{ xs: "column", md: "row-reverse" }}
                    spacing={4}
                    alignItems="center"
                    justifyContent="center"
                    px={isMobile ? 2 : 4}
                    pb={isMobile ? 2 : 4}
                  >
                    {/* Speaker Highlights */}
                    <Typography variant="body1" flex={1} component="div">
                      <strong>Speaker Highlights:</strong>
                      <ul
                        style={{ paddingLeft: "1.25rem", marginTop: "0.5rem" }}
                      >
                        <li>
                          <strong>Ms. Farah Nadeem (WWF-Pakistan):</strong>{" "}
                          Opened the session and highlighted the importance of
                          sustainability and traceability in the local leather
                          sector.
                        </li>
                        <li>
                          <strong>Mr. Henrique Pacini (UNCTAD):</strong> Shared
                          the global perspective of SMEP and stressed the need
                          for inclusive, scalable traceability systems.
                        </li>
                        <li>
                          <strong>Mr. Sohail Ali Naqvi (WWF-Pakistan):</strong>{" "}
                          Discussed WWF’s journey in the leather sector and new
                          environmental regulations affecting the industry.
                        </li>
                        <li>
                          <strong>Ms. Stacci Warrington (SMEP PMA):</strong>{" "}
                          Explained SMEP’s structure, focus areas, and support
                          for cleaner production in developing countries.
                        </li>
                        <li>
                          <strong>Ms. Anne Nistad (LWG):</strong> Outlined the
                          difference between traceability and chain of custody,
                          and LWG’s role in sustainability auditing.
                        </li>
                        <li>
                          <strong>Mr. Mathieu Lamolle (ITC):</strong> Covered
                          the implications of EUDR on global leather trade and
                          support available for MSMEs.
                        </li>
                        <li>
                          <strong>Mr. Adeel Younas (WWF-Pakistan):</strong>{" "}
                          Presented the features of the Digital Traceability
                          Toolkit and WWF’s achievements under SMEP.
                        </li>
                        <li>
                          <strong>
                            Prof. Ebenezer Laryea (LeatherTrace Bangladesh):
                          </strong>{" "}
                          Shared learnings from Bangladesh’s pilot projects on
                          traceability and circularity.
                        </li>
                      </ul>
                    </Typography>

                    <Box
                      component="img"
                      src={images[6]} // replace with your actual image path
                      alt="Webinar Detail 3"
                      sx={{
                        width: "100%",
                        maxWidth: isMobile ? "100%" : 600,
                        borderRadius: 2,
                      }}
                    />
                  </Stack>
                </>
              )}

              {/* Expand/Collapse Icon */}
              <Box sx={{ textAlign: "center", pb: 2 }}>
                {expandedEvent === 1 ? (
                  <ExpandLessIcon sx={{ color: "#888", fontSize: 32 }} />
                ) : (
                  <ExpandMoreIcon sx={{ color: "#888", fontSize: 32 }} />
                )}
              </Box>
            </Box>
          </Card>

          {/* TODO: Add more <Card> components for additional News & Events */}
        </Container>
      </Box>
    </FadeInOnScroll>
  );
}
