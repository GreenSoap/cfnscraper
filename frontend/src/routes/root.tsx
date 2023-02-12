import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GiDeerTrack } from "react-icons/gi";
import { FaStop } from "react-icons/fa";
import {
  Track,
  StopTracking,
  OpenResultsDirectory,
  IsTracking,
  IsInitialized
} from "../../wailsjs/go/main/App";
import { PieChart } from 'react-minimal-pie-chart';
import { AiFillFolderOpen } from 'react-icons/ai'

import { useStatStore } from "../store/use-stat-store";


const Root = () => {
  const { t } = useTranslation();
  const { matchHistory, resetMatchHistory, setTracking, isTracking, isLoading, setLoading, setInitialized, isInitialized } = useStatStore();

  useEffect(() => {
    const getIsTracking = async () => {
      const trackStatus = await IsTracking()
      setTracking(trackStatus)
    }

    const getIsInitialized = async () => {
      const initialized = await IsInitialized()
      setInitialized(initialized)
    }

    if (!isInitialized) {
      getIsInitialized()
    } else if (!isTracking) {
      getIsTracking()
    }
    
  }, []);

  return (
    <main className="grid grid-rows-[0fr_1fr] min-h-screen max-h-screen z-40 flex-1 text-white mx-auto">
      <header className="border-b border-slate-50 backdrop-blur border-opacity-10 select-none " style={{
        '--wails-draggable': 'drag'
      } as React.CSSProperties}>
        <h2 className="pt-4 px-8 flex items-center justify-between gap-5 uppercase text-sm tracking-widest mb-4">
          {isTracking && t('tracking')}
          {isLoading && t('loading')}
          {!isInitialized && t('loading')}

          {!isTracking && isInitialized && !isLoading && t("startTracking")}
          {(isTracking || isLoading || !isInitialized) && (
            <div
              className="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-pink-600 rounded-full"
              role="status"
              aria-label="loading"
            ></div>
          )}
        </h2>
      </header>
      <div className="z-40 h-full flex justify-between items-center px-8 py-4">
        {matchHistory && isTracking && (
          <>
            <div className="relative w-full h-full grid grid-rows-[0fr_1fr] max-w-[320px]">
              <h3 className="whitespace-nowrap max-w-[145px] text-2xl">
                <span className="text-sm block">CFN</span>
                <span className='text-ellipsis block overflow-hidden'>{matchHistory.cfn}</span>
              </h3>
              <h4 className="text-2xl">
                <span className="text-sm block">LP</span>
                {matchHistory && matchHistory.lp && matchHistory.lp}
              </h4>
              <dl className="stat-grid-item w-full mt-2 relative text-center text-lg whitespace-nowrap">
                <div className="mb-2 flex gap-4 justify-between bg-slate-50 bg-opacity-5 p-3 pb-1 rounded-xl backdrop-blur">
                  <dt className="tracking-wider font-extralight">{t('wins')}</dt>
                  <dd className="text-4xl font-semibold">
                    {matchHistory.wins}
                  </dd>
                </div>
                <div className="mb-2 flex gap-4 justify-between bg-slate-50 bg-opacity-5 p-3 pb-1 rounded-xl backdrop-blur">
                  <dt className="tracking-wide font-extralight">{t('losses')}</dt>
                  <dd className="text-4xl font-semibold">
                    {matchHistory.losses}
                  </dd>
                </div>
                <div className="mb-2 flex gap-4 justify-between bg-slate-50 bg-opacity-5 p-3 pb-1 rounded-xl backdrop-blur">
                  <dt className="tracking-wide font-extralight">{t('winRate')}</dt>
                  <dd className="text-4xl font-semibold">
                    {matchHistory.winRate}%
                  </dd>
                </div>
                <div className="mb-2 flex gap-4 justify-between bg-slate-50 bg-opacity-5 p-3 pb-1 rounded-xl backdrop-blur">
                  <dt className="tracking-wide font-extralight">{t('winStreak')}</dt>
                  <dd className="text-4xl font-semibold">
                    {matchHistory.winStreak}
                  </dd>
                </div>
                <div className="mb-2 flex gap-4 justify-between bg-slate-50 bg-opacity-5 p-3 pb-1 rounded-xl backdrop-blur">
                  <dt className="tracking-wide font-extralight">{t('lpGain')}</dt>
                  <dd className="text-4xl font-semibold">
                    {(matchHistory.lpGain > 0) && '+'}
                    {matchHistory.lpGain}
                  </dd>
                </div>
              </dl>
            </div>
            {matchHistory && isTracking && (
              <div className='relative mr-4 h-full grid justify-items-center'>
                <PieChart
                  className='pie-chart animate-enter max-w-[160px] max-h-[160px] mt-12 backdrop-blur'
                  animate={true}
                  lineWidth={75}
                  paddingAngle={0}
                  animationDuration={10}
                  viewBoxSize={[60, 60]}
                  center={[30, 30]}
                  animationEasing={'ease-in-out'}
                  data={[
                    { title: 'Wins', value: matchHistory.wins, color: 'rgba(0, 255, 77, .65)' },
                    { title: 'Losses', value: matchHistory.losses, color: 'rgba(251, 73, 73, 0.25)' },
                  ]}
                >
                  <defs>
                    <linearGradient id="blue-gradient" direction={-65}>
                      <stop offset="0%" stopColor="#20BF55" />
                      <stop offset="100%" stopColor="#347fd0" />
                    </linearGradient>
                    <linearGradient id="red-gradient" direction={120}>
                      <stop offset="0%" stopColor="#EC9F05" />
                      <stop offset="100%" stopColor="#EE9617" />
                    </linearGradient>
                  </defs>
                </PieChart>

                <div className='relative bottom-[-20px] right-[-10px]'>
                  <button
                    onClick={() => {
                      OpenResultsDirectory()
                    }}
                    style={{
                      filter: 'hue-rotate(-120deg)'
                    }}
                    type="button"
                    className="whitespace-nowrap mb-2 flex items-center justify-between bg-[rgba(255,10,10,.1)] rounded-md px-5 py-3 border-[#FF3D51] hover:bg-[#FF3D51] border-[1px] transition-colors font-semibold text-md"
                  >
                    <AiFillFolderOpen className='w-4 h-4 mr-2'/>
                    {t('openResultFolder')}
                  </button>

                  <button
                    onClick={() => {
                      StopTracking();
                      setTracking(false);
                      setLoading(false);
                    }}
                    type="button"
                    className="float-right bottom-2 flex items-center justify-between bg-[rgba(255,10,10,.1)] rounded-md px-5 py-3 border-[#FF3D51] hover:bg-[#FF3D51] border-[1px] transition-colors font-semibold text-md"
                  >
                    <FaStop className="mr-3" /> {t('stop')}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        {!(isTracking || isLoading || !isInitialized) && (
          <form
            className="mx-auto"
            onSubmit={(e) => {
              e.preventDefault();

              const cfn = (e.target as any).cfn.value;
              if (cfn == "") return;
              setLoading(true);
              const startTrack = async () => {
                const isInitialized = await IsInitialized()
                if (isInitialized == false) {
                  setLoading(false)
                  return
                }

                const isTracking = await Track(cfn);
                if (isTracking == false) {
                  alert("Failed to track CFN");
                } else {
                  resetMatchHistory()
                }
              };
              startTrack();
            }}
          >
            <h3 className="mb-2">{t('enterCfnName')}</h3>
            <input
              disabled={isLoading}
              type="text"
              name="cfn"
              className="py-3 px-4 block w-full border-gray-200 rounded-md text-lg focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300"
              placeholder={t("cfnName")!}
              autoCapitalize='off'
              autoComplete='off'
              autoCorrect='off'
              autoSave='off'
            />
            <div className="flex justify-end">
              <button
                disabled={isLoading}
                type="submit"
                style={{
                  filter: 'hue-rotate(156deg)'
                }}
                className="mt-4 flex select-none items-center justify-between bg-[rgba(255,10,10,.1)] rounded-md px-5 py-3 border-[#FF3D51] hover:bg-[#FF3D51] border-[1px] transition-colors font-semibold text-md"
              >
                <GiDeerTrack className="mr-3" /> {t("start")}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
};

export default Root;