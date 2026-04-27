import React from "react";
import Section from "../common/Section";
import { useDynamicSections } from "../../utils/sectioning";

function SkillRating({ skillName, rating, color }) {
  return (
    <div className="mb-3">
      <div className="mb-1.5 text-xs font-bold text-zinc-800">{skillName}</div>
      <div className="flex gap-1.5">
        {[...Array(5)].map((_, index) => (
          <div
            className="w-3.5 h-3.5 rounded-full border-2 border-solid border-zinc-800"
            key={index}
            style={{
              background: index < rating ? color : "#E5E5E5",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SkillsSection({ skills = [] }) {
  if (!skills || skills.length === 0) return null;
  
  return (
    <section className="p-5 mt-6 rounded-3xl border-2 border-solid border-zinc-800">
      <div className="inline-block px-6 py-2 mb-4 bg-green-500 rounded-3xl border-2 border-solid border-zinc-800">
        <span className="text-xs font-bold text-[white]">Personal Skills</span>
      </div>
      {skills.map((skill, idx) => (
        <SkillRating key={idx} skillName={skill.name} rating={skill.rating} color={skill.color} />
      ))}
    </section>
  );
}

function ContactItem({ bgColor, children }) {
  return (
    <div className="flex gap-2.5 items-center mb-2.5">
      <div
        className={`flex justify-center items-center w-5 h-5 ${bgColor} rounded-full`}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 2H10V10H2V2Z"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>
      <span className="text-xs text-zinc-800">{children}</span>
    </div>
  );
}

function ContactInfo({ phone, email, website, address }) {
  return (
    <section className="mt-6">
      {phone && (
        <ContactItem bgColor="bg-green-500">{phone}</ContactItem>
      )}
      {email && (
        <ContactItem bgColor="bg-orange-400">{email}</ContactItem>
      )}
      {website && (
        <ContactItem bgColor="bg-rose-300">{website}</ContactItem>
      )}
      {address && (
        <div className="flex gap-2.5 items-center">
          <div className="flex justify-center items-center w-5 h-5 bg-green-500 rounded-full">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 2H10V10H2V2Z"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>
          <address className="text-xs text-zinc-800 not-italic">
            {address}
          </address>
        </div>
      )}
    </section>
  );
}

function ProfileSection({ profileImage, summary, skills, phone, email, website, address }) {
  return (
    <aside className="relative p-6 bg-stone-100 w-[270px]">
      <div className="absolute top-6 left-12 h-[60px] w-[60px] z-[1]">
        <div className="relative bg-orange-400 rounded-full h-[60px] w-[60px]">
          {[...Array(12)].map((_, index) => (
            <div
              className="absolute top-2/4 left-2/4 w-6 h-6 bg-orange-400 origin-[0_0]"
              key={index}
              style={{
                transform: `rotate(${index * 30}deg) translate(-12px, -12px)`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="absolute top-6 right-6 w-12 h-12 z-[1]">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path
            d="M8 24L18 34L40 12"
            stroke="#28CA41"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="overflow-hidden relative mx-auto mt-9 bg-black rounded-3xl h-[200px] w-[200px] z-[2]">
        <img
          src={profileImage || "https://cdn.builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d"}
          alt="Profile"
          className="object-cover size-full"
        />
      </div>
      {summary && (
        <section className="mt-6">
          <div className="flex gap-3 items-center mb-3">
            <div className="flex justify-center items-center w-8 h-8 bg-orange-400 rounded-full">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 9C11.07 9 12.75 7.32 12.75 5.25C12.75 3.18 11.07 1.5 9 1.5C6.93 1.5 5.25 3.18 5.25 5.25C5.25 7.32 6.93 9 9 9ZM9 10.5C6.495 10.5 1.5 11.7525 1.5 14.25V16.5H16.5V14.25C16.5 11.7525 11.505 10.5 9 10.5Z"
                  fill="white"
                />
              </svg>
            </div>
            <h2 className="text-base font-bold text-zinc-800">My Profile</h2>
          </div>
          <p className="m-0 text-xs leading-normal text-zinc-800">
            {summary}
          </p>
        </section>
      )}
      <SkillsSection skills={skills} />
      <ContactInfo phone={phone} email={email} website={website} address={address} />
      <div className="absolute left-0 bottom-6 w-12 h-12">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path
            d="M8 28L12 38L18 32L8 28Z"
            fill="#FF8C42"
            stroke="#333"
            strokeWidth="2"
          />
          <path
            d="M14 14L40 8V36L14 30V14Z"
            fill="#FFBD2E"
            stroke="#333"
            strokeWidth="2"
          />
        </svg>
      </div>
    </aside>
  );
}

function EducationItem({ dotColor, school, degree, years }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex gap-3 items-start">
        <div className={`shrink-0 mt-1 w-2.5 h-2.5 ${dotColor} rounded-full`} />
        <div>
          <h3 className="mx-0 mt-0 mb-1 text-xs font-bold text-zinc-800">
            {school}
          </h3>
          <p className="mx-0 mt-0 mb-0.5 text-xs text-stone-500">{degree}</p>
          <p className="m-0 text-xs text-stone-500">{years}</p>
        </div>
      </div>
    </div>
  );
}

function EducationSection({ educations = [] }) {
  if (!educations || educations.length === 0) return null;
  
  return (
    <section className="relative p-5 mb-5 rounded-3xl border-2 border-solid border-zinc-800">
      <div className="inline-block px-6 py-2 mb-4 bg-rose-300 rounded-3xl border-2 border-solid border-zinc-800">
        <span className="text-xs font-bold text-[white]">Education</span>
      </div>
      {educations.map((edu, idx) => (
        <EducationItem
          key={idx}
          dotColor={edu.dotColor || "bg-green-500"}
          school={edu.school}
          degree={edu.degree}
          years={edu.years}
        />
      ))}
    </section>
  );
}

function WorkItem({ dotColor, company, location, description }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex gap-3 items-start">
        <div className={`shrink-0 mt-1 w-2.5 h-2.5 ${dotColor} rounded-full`} />
        <div>
          <h3 className="mx-0 mt-0 mb-1 text-xs font-bold text-zinc-800">
            {company}
          </h3>
          <p className="mx-0 mt-0 mb-1 text-xs text-stone-500">{location}</p>
          <p className="m-0 text-xs leading-snug text-zinc-800">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function WorkExperience({ experiences = [] }) {
  if (!experiences || experiences.length === 0) return null;
  
  return (
    <section className="relative p-5 rounded-3xl border-2 border-solid border-zinc-800">
      <div className="inline-block px-6 py-2 mb-4 bg-orange-400 rounded-3xl border-2 border-solid border-zinc-800">
        <span className="text-xs font-bold text-[white]">Work Experience</span>
      </div>
      {experiences.map((exp, idx) => (
        <WorkItem
          key={idx}
          dotColor={exp.dotColor || "bg-orange-400"}
          company={exp.company}
          location={exp.location}
          description={exp.description}
        />
      ))}
    </section>
  );
}

function MainContent({ name, jobTitle, educations, experiences, sectionBlocks, main }) {
  return (
    <main className="relative flex-1 px-6 py-8 bg-stone-100">
      <header className="mb-6">
        <h1 className="m-0 text-5xl font-black tracking-tighter leading-none text-zinc-800">
          {name ? (
            <>
              {name.split(" ")[0]}
              <br />
              {name.split(" ").slice(1).join(" ")}
            </>
          ) : (
            <>
              Isabel
              <br />
              Mercado
            </>
          )}
        </h1>
        {jobTitle && (
          <div className="inline-block px-5 py-2 mt-3 bg-green-500 rounded-3xl border-2 border-solid border-zinc-800">
            <span className="text-xs font-bold tracking-wider text-[white]">
              {jobTitle.toUpperCase()}
            </span>
          </div>
        )}
      </header>
      {main.map((key) => (
        <Section key={key} show>
          {sectionBlocks[key]}
        </Section>
      ))}
    </main>
  );
}

function CurriculumVitae({ name, jobTitle, summary, phone, email, website, address, profileImage, skills, educations, experiences } = {}) {
  const sectionBlocks = {
    education: <EducationSection educations={educations} />,
    experience: <WorkExperience experiences={experiences} />,
  };
  const { main } = useDynamicSections(
    { educations, experiences },
    { sidebar: [], main: ["education", "experience"], minMain: 1 }
  );
  return (
    <div className="flex overflow-hidden flex-col justify-center items-center bg-white h-[842px] w-[596px]">
      <div className="flex relative h-[845px] w-[596px]">
        <div className="overflow-hidden absolute rounded-3xl bg-stone-100 h-[812px] left-[15px] top-[15px] w-[566px]">
          <header className="flex relative justify-end items-center pr-6 w-full h-14 border-b-2 border-solid bg-stone-100 border-b-zinc-800">
            <div className="flex absolute top-4 left-8 gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full" />
              <div className="w-3 h-3 bg-amber-400 rounded-full" />
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <span className="text-xs font-bold tracking-wider text-zinc-800">
              CURRICULUM VITAE
            </span>
          </header>
          <div className="flex h-[calc(100%_-_56px)]">
            <ProfileSection
              profileImage={profileImage}
              summary={summary}
              skills={skills}
              phone={phone}
              email={email}
              website={website}
              address={address}
            />
            <MainContent
              name={name}
              jobTitle={jobTitle}
              educations={educations}
              experiences={experiences}
              sectionBlocks={sectionBlocks}
              main={main}
            />
          </div>
        </div>
        <div className="flex absolute bottom-0 left-0">
          {[...Array(7)].map((_, index) => (
            <div
              key={index}
              style={{
                width: index === 0 ? "40px" : "24px",
                height: index === 0 ? "40px" : "24px",
                background: index % 2 === 0 ? "#EC9EB7" : "#F5C0D3",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CurriculumVitae;
