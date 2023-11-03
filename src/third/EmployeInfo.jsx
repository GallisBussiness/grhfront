import { Avatar, Text, Button, Paper } from '@mantine/core';

export function EmployeInfo({employe}) {
  return (
    <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
      <Avatar
        src={`${import.meta.env.VITE_BACKURL}/uploads/profiles/${employe?.profile}`}
        size={120}
        radius={120}
        mx="auto"
      />
      <Text ta="center" fz="lg" fw={500} mt="md">
        PRENOM : {`${employe?.prenom} ${employe?.nom}`}
      </Text>
      <Text ta="center" c="dimmed" fz="sm">
        POSTE : {`${employe?.poste}`}
      </Text>
      <Text ta="center" c="dimmed" fz="sm">
        TELEPHONE : {`${employe?.telephone}`}
      </Text>
    </Paper>
  );
}