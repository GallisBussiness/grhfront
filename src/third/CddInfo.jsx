import { Avatar, Text, Paper} from '@mantine/core';

export function CddInfo({employe}) {
 
  return (
    <Paper radius="md" withBorder p="lg" bg="blue">
     {employe &&  <Avatar
        src={employe?.profile ? `${import.meta.env.VITE_BACKURL}/uploads/profiles/${employe?.profile}` : '/avatar.png'}
        size={120}
        radius={120}
        mx="auto"
      />}
      <Text ta="center" fz="lg" fw={500} mt="md" className="text-white">
        PRENOM : {`${employe?.prenom} ${employe?.nom}`}
      </Text>
      <Text ta="center" c="dimmed" fz="sm" className="text-white">
        POSTE : {`${employe?.poste}`}
      </Text>
      <Text ta="center" c="dimmed" fz="sm" className="text-white">
        TELEPHONE : {`${employe?.telephone}`}
      </Text>
    </Paper>
  );
}