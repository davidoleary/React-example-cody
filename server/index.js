import app from './src/app';

const PORT = process.env.PORT || 6778;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}!`, process.env.PUBLIC_URL);
});

export default app;
