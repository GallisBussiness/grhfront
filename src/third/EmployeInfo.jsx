import { Avatar, Text, Paper, LoadingOverlay } from '@mantine/core';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { getActiveNominationByEmploye } from '../services/nominationservice';

export function EmployeInfo({employe}) {
  const key = ['GET_NOMINATION_ACTIVE',employe?._id];
  const [nomination,setNomination] = useState('');
  const {isLoading} = useQuery(key,() => getActiveNominationByEmploye(employe?._id),{
    onSuccess:(d) => {
      if(d.length === 0){
        setNomination(employe?.poste);
      }else {
        const ns = d.map(_ => _.fonction.nom);
      setNomination(ns.join(','));
      }
      
    }
  })
  return (
    <Paper radius="md" withBorder p="lg" bg="blue">
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue', type: 'bars' }} />
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
        POSTE : {`${nomination}`}
      </Text>
      <Text ta="center" c="dimmed" fz="sm" className="text-white">
        TELEPHONE : {`${employe?.telephone}`}
      </Text>
    </Paper>
  );
}