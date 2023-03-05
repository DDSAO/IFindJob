import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { User } from "@/interfaces/userDefinitions";
import { getCookie } from "cookies-next";
import { verifyToken } from "@/lib/db";
import { PageWithNav } from "@/components/Tailwind/Layouts/PageWithNav";
import { SlideButton } from "@/components/Tailwind/Button/SlideButton";
import { BiSave } from "react-icons/bi";
import { atom, useRecoilState } from "recoil";
import { TextField } from "@/components/Tailwind/Input/TextField";
import { EMPTY_JOB, Job } from "@/interfaces/jobDefinition";
import { TextArea } from "@/components/Tailwind/Input/TextArea";
import { useThumbUp } from "@/lib/hooks/useThumbUp";
import usePost from "./../../../lib/hooks/usePost";
import { useRouter } from "next/router";

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

export const JobAtom = atom({
  key: "/job/create/JobAtom",
  default: EMPTY_JOB,
});

export default function Page({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [job, setJob] = useRecoilState(JobAtom);
  const play = useThumbUp();

  const createJob = usePost<{ job: Job }, { job: Job }>({
    url: "/job/createJob",
    onComplete: (data) => {
      if (data && data.job) {
        play();
        setJob(EMPTY_JOB);
      }
    },
  });

  return (
    <PageWithNav user={user}>
      <div className="bg-white shadow-md rounded-md p-4 m-4">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 p-2 lg:p-6">
          <p className=" w-fit text-2xl border-b-2 border-black">Create Job</p>
          <div className="lg:col-span-4"></div>
          <div className="flex items-center justify-end">
            <SlideButton
              loading={createJob.loading}
              color="green"
              text="Create"
              onClickF={() => {
                createJob.reload({
                  job,
                });
              }}
              startIcon={<BiSave size="16px" />}
            />
          </div>
          <div className="lg:col-span-2">
            <TextField
              title={"Company Name"}
              value={job.company}
              onChangeF={(e) => {
                setJob({
                  ...job,
                  company: e.target.value,
                });
              }}
            />
          </div>
          <div className="lg:col-span-2">
            <TextField
              title={"Position"}
              value={job.position}
              onChangeF={(e) => {
                setJob({
                  ...job,
                  position: e.target.value,
                });
              }}
            />{" "}
          </div>

          <div className="lg:col-span-6">
            <TextArea
              title={"Job Description"}
              rows={20}
              value={job.jobDescription}
              onChangeF={(e) => {
                setJob({
                  ...job,
                  jobDescription: e.target.value,
                });
              }}
            />
          </div>
        </div>
      </div>
    </PageWithNav>
  );
}
