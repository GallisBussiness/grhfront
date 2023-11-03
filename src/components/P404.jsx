import { Container, Title, Text } from '@mantine/core';


const P404 = () => {
  const { classes } = useStyles();

  return (
    <Container>
      <div >
        <div >
          <Title>Nothing to see here</Title>
          <Text color="dimmed" size="lg" align="center" >
            Page you are trying to open does not exist. You may have mistyped the address, or the
            page has been moved to another URL. If you think this is an error contact support.
          </Text>
        </div>
      </div>
    </Container>
  );
}

export default P404;