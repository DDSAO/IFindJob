import { SlideButton } from "@/components/Tailwind/Button/SlideButton";
import { FixedField } from "@/components/Tailwind/Input/FixedField";
import { Expand } from "@/components/Tailwind/Transition/Expand";
import { Job } from "@/interfaces/jobDefinition";
import { timestampToDateTimeStr } from "@/lib/utils";
import { useState } from "react";
import { useEffect } from "react";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import usePost from "./../../../../lib/hooks/usePost";

export const JobCard = (props: { job: Job | null }) => {
  const { job } = props;

  const [expandDescription, setExpandDescription] = useState(false);
  const [expandCoverLetter, setExpandCoverLetter] = useState(false);

  useEffect(() => {
    setExpandDescription(false);
    setExpandCoverLetter(false);
  }, [job?.id]);

  const writeCoverLetter = usePost<{}, {}>({
    url: "/job/writeCoverLetter",
  });

  if (!job) return null;
  return (
    <div className="bg-white p-2 rounded-md shadow-md grid grid-cols-2 gap-4">
      <p className="col-span-2 text-2xl font-bold">{job.company}</p>
      <FixedField title="Position" value={job.position} />
      <FixedField
        title="Created At"
        value={job.createdAt ? timestampToDateTimeStr(job.createdAt) : null}
      />
      <div
        onClick={() => {
          setExpandDescription(!expandDescription);
        }}
        className="col-span-2 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-between"
      >
        <p>Job Description</p>
        {expandDescription ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
      </div>
      <div className="col-span-2">
        <Expand open={expandDescription}>
          <p className="col-span-2 text-sm whitespace-pre-wrap">
            {job.jobDescription}
          </p>
        </Expand>
      </div>

      <div
        onClick={() => {
          setExpandCoverLetter(!expandCoverLetter);
        }}
        className="col-span-2 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-between"
      >
        <p>Cotter Letter</p>
        {expandCoverLetter ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
      </div>
      {job.coverLetter ? (
        <div className="col-span-2">
          <Expand open={expandCoverLetter}>
            <p className="col-span-2 text-sm whitespace-pre-wrap">
              {job.coverLetter}
            </p>
          </Expand>
        </div>
      ) : (
        <div className="col-span-2 flex items-center justify-center">
          <SlideButton
            loading={writeCoverLetter.loading}
            text="Generate Cover Letter"
            onClickF={() => {
              writeCoverLetter.reload({});
            }}
          />
        </div>
      )}
    </div>
  );
};
