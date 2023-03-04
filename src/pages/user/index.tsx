import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { User } from "@/interfaces/userDefinitions";
import { getCookie } from "cookies-next";
import { verifyToken } from "@/lib/db";
import { PageWithNav } from "@/components/Tailwind/Layouts/PageWithNav";
import { useState } from "react";
import { TextField } from "@/components/Tailwind/Input/TextField";
import { TextArea } from "@/components/Tailwind/Input/TextArea";
import { SlideButton } from "@/components/Tailwind/Button/SlideButton";
import { BiSave } from "react-icons/bi";

interface PageProps {
  user: User;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  req,
  res,
}) => {
  let token = getCookie("token", { req, res });
  let user = await verifyToken(token?.toString());

  if (!user)
    return {
      redirect: {
        destination: "/signIn",
        permanent: false,
      },
    };

  return {
    props: {
      user: { ...user, _id: user._id.toString() },
    },
  };
};

export default function Page({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [theUser, setUser] = useState(user);

  return (
    <PageWithNav user={user}>
      <div className="bg-white shadow-md rounded-md p-4 m-4">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 p-2 lg:p-6">
          <p className=" w-fit text-2xl border-b-2 border-black">User Page</p>
          <div className="lg:col-span-4"></div>
          <div className="flex items-center justify-end">
            <SlideButton
              color="yellow"
              text="Save"
              onClickF={() => {}}
              startIcon={<BiSave size="16px" />}
            />
          </div>

          <p className="lg:col-span-6 text-lg text-slate-100 px-2 bg-blue-400 rounded-md shadow-md w-fit">
            Basic Info
          </p>
          <TextField
            title="Name"
            value={theUser.name}
            onChangeF={(e) => {
              setUser({
                ...theUser,
                name: e.target.value,
              });
            }}
          />
          <TextField
            title="Highest Degree"
            value={theUser.degree}
            onChangeF={(e) => {
              setUser({
                ...theUser,
                degree: e.target.value,
              });
            }}
          />
          <div className="lg:col-span-6">
            <TextArea
              rows={10}
              title="Work Experience"
              value={theUser.workExperience}
              onChangeF={(e) => {
                setUser({
                  ...theUser,
                  workExperience: e.target.value,
                });
              }}
            />
          </div>
          <div className="lg:col-span-3">
            <TextArea
              rows={5}
              title="Awards"
              value={theUser.awards}
              onChangeF={(e) => {
                setUser({
                  ...theUser,
                  awards: e.target.value,
                });
              }}
            />
          </div>
          <div className="lg:col-span-3">
            <TextArea
              rows={5}
              title="Tech Stacks"
              value={theUser.techStacks}
              onChangeF={(e) => {
                setUser({
                  ...theUser,
                  techStacks: e.target.value,
                });
              }}
            />
          </div>
        </div>
      </div>
    </PageWithNav>
  );
}
