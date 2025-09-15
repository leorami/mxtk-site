import IconCard from '@/components/ui/IconCard';
import { SparkleIcon } from '@/components/ui/MineralIcon';

export default function SummaryCard({ title='Overview', data, icon }: { id:string; title?:string; data?:any; icon?: React.ReactNode }){
  return (
    <div className="p-2">
      <IconCard icon={icon || <SparkleIcon className="w-6 h-6" />} title={title}>
        {data?.text || 'A concise explanation of MXTK tailored to your Journey. Use Sherpa to refine this summary.'}
      </IconCard>
    </div>
  );
}




