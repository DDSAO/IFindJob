import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { User } from "@/interfaces/userDefinitions";
import { getCookie } from "cookies-next";
import { JobCollection, verifyToken } from "@/lib/db";
import { PageWithNav } from "@/components/Tailwind/Layouts/PageWithNav";
import { EMPTY_JOB_FILTER, Job, JobFilters } from "@/interfaces/jobDefinition";
import { atom } from "recoil";
import { useRecoilState } from "recoil";
import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_TABLE_WITH_CARDS_TRIGGERS,
  TableWithCard,
  TriggersAtom,
} from "@/components/Tailwind/Table/TableWithCard";
import usePost from "@/lib/hooks/usePost";
import { getNow, timestampToDateStr } from "./../../../lib/utils";
import { useRouter } from "next/router";
import { BasicTable } from "@/components/Tailwind/Table/BasicTable";
import { isEqual } from "lodash";
import { TextField } from "@/components/Tailwind/Input/TextField";
import { SlideButton } from "@/components/Tailwind/Button/SlideButton";
import { AiOutlineClear, AiOutlineSearch } from "react-icons/ai";
import { JobCard } from "@/components/app/job/list/JobCard";

interface PageProps {
  user: User;
  jobs: Job[];
  filters: JobFilters;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  req,
  res,
  query,
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

  let page_no = !isNaN(parseInt(String(query.page_no)))
      ? parseInt(String(query.page_no))
      : 1,
    page_num = !isNaN(parseInt(String(query.page_num)))
      ? parseInt(String(query.page_num))
      : 20;

  let parsedFilters: any = {};
  if (query.id) {
    parsedFilters.id = parseInt(String(query.id));
  } else {
    if (query.company) {
      parsedFilters.company = new RegExp(String(query.company), "i");
    }
    if (query.position) {
      parsedFilters.position = new RegExp(String(query.position), "i");
    }
    if (query.jobDescription) {
      parsedFilters.jobDescription = new RegExp(
        String(query.jobDescription),
        "i"
      );
    }
  }

  let jobs = await JobCollection.find(parsedFilters)
    .skip((page_no - 1) * page_num)
    .limit(page_num)
    .toArray();

  return {
    props: {
      user: { ...user, _id: user._id.toString() },
      jobs: jobs.map((job) => ({
        ...job,
        _id: job._id.toString(),
      })),
      filters: {
        id: query.id ? parseInt(String(query.id)) : null,
        company: query.company ? String(query.company) : null,
        position: query.position ? String(query.position) : null,
        jobDescription: query.jobDescription
          ? String(query.jobDescription)
          : null,

        page_no,
        page_num,
      },
    },
  };
};
export const JobAtom = atom<Job | null>({
  key: "/job/list/JobJobAtomsAtom",
  default: null,
});
export const JobsAtom = atom<Job[]>({
  key: "/job/list/JobsAtom",
  default: [],
});
export const FiltersAtom = atom<JobFilters>({
  key: "/job/list/FiltersAtom",
  default: EMPTY_JOB_FILTER,
});
export const ClearListSelectAtom = atom({
  key: "/job/list/ClearListSelectAtom",
  default: 0,
});

export default function Page({
  user,
  jobs,
  filters,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [job, setJob] = useRecoilState(JobAtom);

  const [theJobs, setJobs] = useRecoilState(JobsAtom);
  const [theFilters, setFilters] = useRecoilState(FiltersAtom);
  const router = useRouter();

  const [totalNum, setTotalNum] = useState(0);

  const [triggers, setTriggers] = useRecoilState(TriggersAtom);

  const [requireClearSelect, setRequireClearSelect] =
    useRecoilState(ClearListSelectAtom);

  useEffect(() => {
    setJobs(jobs);
    setFilters(filters);
    setTriggers(DEFAULT_TABLE_WITH_CARDS_TRIGGERS);
  }, [jobs, filters]);

  const closeCardF = useMemo(
    () => () => {
      setTriggers({
        ...triggers,
        triggerClose: true,
      });
      setTimeout(() => setJob(null), 350);
      setRequireClearSelect(getNow());
    },
    []
  );

  const updateCard = useMemo(
    () => (newJob: Job) => {
      let index = jobs.findIndex((theJob) => theJob.id === newJob.id);
      if (index !== -1) {
        setJobs([...jobs.slice(0, index), newJob, ...jobs.slice(index + 1)]);
      }
      setJob(newJob);
    },
    [job, jobs]
  );

  return (
    <PageWithNav user={user}>
      <div className="bg-white shadow-md rounded-md p-4 m-4">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 p-2 ">
          <p className=" lg:col-span-6 w-fit text-2xl border-b-2 border-black">
            Job Lists
          </p>
          <div className="lg:col-span-6 p-4 rounded-md shadow-md grid lg:grid-cols-4 gap-4">
            <TextField
              inputType="number"
              title="id"
              value={theFilters.id}
              onChangeF={(e) => {
                setFilters({
                  ...theFilters,
                  id: parseInt(e.target.value),
                });
              }}
            />
            <TextField
              title="Company"
              value={theFilters.company}
              onChangeF={(e) => {
                setFilters({
                  ...theFilters,
                  company: e.target.value,
                });
              }}
            />
            <TextField
              title="Position"
              value={theFilters.position}
              onChangeF={(e) => {
                setFilters({
                  ...theFilters,
                  position: e.target.value,
                });
              }}
            />
            <TextField
              title="Job description"
              value={theFilters.jobDescription}
              onChangeF={(e) => {
                setFilters({
                  ...theFilters,
                  jobDescription: e.target.value,
                });
              }}
            />
            <div className="col-start-4 flex items-center justify-between">
              <SlideButton
                startIcon={<AiOutlineClear />}
                color="yellow"
                text="Clear"
                onClickF={() => {
                  router.push({
                    pathname: "/job/list",
                    query: {
                      ...EMPTY_JOB_FILTER,
                    },
                  });
                }}
              />
              <SlideButton
                startIcon={<AiOutlineSearch />}
                text="Search"
                onClickF={() => {
                  router.push({
                    pathname: "/job/list",
                    query: {
                      ...theFilters,
                    },
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="lg:col-span-6 p-2">
          <TableWithCard
            table={
              <div className="p-4">
                <BasicTable
                  headers={["ID", "Company", "Position", "Created At"]}
                  rows={jobs.map((jobInJobs) => {
                    return [
                      <p className="text-center" key={1}>
                        {jobInJobs.id}
                      </p>,
                      <p className="text-left" key={2}>
                        {jobInJobs.company}
                      </p>,
                      <p className="text-center" key={2}>
                        {jobInJobs.position}
                      </p>,

                      <p className="text-center">
                        {jobInJobs.createdAt
                          ? timestampToDateStr(jobInJobs.createdAt)
                          : ""}
                      </p>,
                    ];
                  })}
                  enablePagination={true}
                  totalNum={totalNum}
                  onPageChangeF={(page_no, page_num) => {
                    setFilters({
                      ...filters,
                      page_no,
                      page_num,
                    });
                  }}
                  allowExport={true}
                  requireClearSelect={requireClearSelect}
                  onSelectChange={(i) => {
                    if (i === null) {
                      if (job !== null) {
                        closeCardF();
                      }
                    } else {
                      if (i !== -1) {
                        if (job && job.id) {
                          setTriggers({
                            ...triggers,
                            triggerRefresh: true,
                          });
                          setTimeout(() => {
                            setJob(jobs[i]);
                          }, 350);
                        } else {
                          setTriggers({
                            ...triggers,
                            triggerOpen: true,
                          });
                          setJob(jobs[i]);
                        }
                      } else {
                        closeCardF();
                      }
                    }
                  }}
                  remainSelectedOnLeave={true}
                />
              </div>
            }
            card={
              <JobCard job={job} />
              // <BuybackInfoCard
              //   buyback={buyback}
              //   uploadOnComplete={(newBuyback) => {
              //     updateCard(newBuyback);
              //     play();
              //   }}
              //   sendEmailOnComplete={(newBuyback) => {
              //     updateCard(newBuyback);
              //     play();
              //   }}
              //   onClose={closeCardF}
              // />
            }
            triggerRefresh={triggers.triggerRefresh}
            onRefresh={() => {
              setTriggers({
                ...triggers,
                triggerRefresh: false,
              });
            }}
            triggerOpen={triggers.triggerOpen}
            onOpen={() => {
              setTriggers({
                ...triggers,
                triggerOpen: false,
              });
            }}
            triggerClose={triggers.triggerClose}
            onClose={() => {
              closeCardF();
            }}
          />
        </div>
        <div className="min-h-screen"></div>
      </div>
      <div className="py-4"></div>
    </PageWithNav>
  );
}
