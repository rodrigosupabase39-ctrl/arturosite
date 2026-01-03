import Header from "@/components/Header";
import Image from "next/image";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <>
      <Header />
      <Box
        component="div"
        sx={{
          width: '100vw',
          height: { xs: 'calc(100vh - 64px)', sm: 'calc(100vh - 64px)', md: 'calc(100vh - 64px)' },
          backgroundColor: '#030303',
          position: 'relative',
          overflow: 'hidden',
          padding: '0 !important',
          margin: '0 !important',
          left: 0,
          right: 0,
          boxSizing: 'border-box',
          maxWidth: '100% !important',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& img': {
            display: 'block',
            margin: 0,
            padding: 0,
          },
        }}
      >
        {/* Imagen centrada */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            animation: 'fadeIn 1.5s ease-in forwards',
            '@keyframes fadeIn': {
              '0%': {
                opacity: 0,
              },
              '100%': {
                opacity: 1,
              },
            },
          }}
        >
          <Image
            src="/arturo.jpg?v=2"
            alt="Arturo Villanueva"
            fill
            style={{
              objectFit: 'contain',
              objectPosition: 'center',
              margin: 0,
              padding: 0,
              display: 'block',
            }}
            priority
            sizes="100vw"
            unoptimized
          />
        </Box>
      </Box>
    </>
  );
}
