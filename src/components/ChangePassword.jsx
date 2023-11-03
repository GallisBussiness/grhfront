import { useAuthUser, useSignIn } from "react-auth-kit";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "react-query";
import { Controller, useForm } from "react-hook-form";
import {
  PasswordInput,
  Group,
  Button,
  Stack,
  LoadingOverlay,
} from "@mantine/core";
import {  updatePassword } from "../services/authservice";
import { toaster } from "evergreen-ui";

const schema = yup
  .object({
    oldPass: yup.string().required(),
    newPass: yup.string().required(),
  })
  .required();

function ChangePassword() {

    const auth = useAuthUser()();
    const signIn = useSignIn();
  
    const defaultValues = { oldPass: "", newPass: "" };
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(schema),
      defaultValues,
    });
  
    const { mutate, isLoading } = useMutation((data) => updatePassword(auth?.id,data), {
      onSuccess(data) {
        toaster.success("Votre mot de passe a été modifié !!");
      },
      onError: (_) => {
        toaster.danger("Verifier si les mots de passe correspondents");
      },
    });
  
    const onConnect = (data) => {
      mutate(data);
    };

  return (
    <>
    <LoadingOverlay visible={isLoading} overlayBlur={2} />
    <div className="hero h-2/3 text-white">
    <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-white p-4 animate__animated animate__zoomInLeft">
          <form onSubmit={handleSubmit(onConnect)} method="POST">
            <Stack>
            <Controller
                control={control}
                name="oldPass"
                render={({ field }) => (
                  <>
                    <PasswordInput
                      label="Ancien Mot de Passe"
                      placeholder="Votre nouveau mot de passe"
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(event.currentTarget.value)
                      }
                      error={errors.oldPass &&  errors.oldPass.message}
                    />
                  </>
                )}
              />

              <Controller
                control={control}
                name="newPass"
                render={({ field }) => (
                  <>
                    <PasswordInput
                      label="Nouveau Mot de Passe"
                      placeholder="Votre nouveau mot de passe"
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(event.currentTarget.value)
                      }
                      error={errors.newPass &&  errors.newPass.message}
                    />
                  </>
                )}
              />
            </Stack>

            <Group position="apart" mt="xl">
              <Button type="submit" className="bg-cyan-900 hover:bg-cyan-500">
                Changer le Mot de Passe
              </Button>
            </Group>
          </form>
        </div>
    </div>
  </>
  )
}

export default ChangePassword