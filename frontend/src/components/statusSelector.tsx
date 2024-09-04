import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { statusValues } from '@/types/order';

interface StatusSelectorProps{
    status: statusValues | '';
    setStatus: (status: statusValues | '') => void;
}

export default function StatusSelector({status, setStatus}:StatusSelectorProps) {
    
    const handleChange = (value: statusValues | 'all') => {
        setStatus(value === 'all' ? '' : value)
    }

    return (
        <Select value={status} onValueChange={handleChange}>
            <SelectTrigger className='w-[90px]'>
                <SelectValue placeholder='Status'/>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                <SelectItem value='CANCELLED'>Cancelled</SelectItem>
                <SelectItem value='PROCESSING'>Processing</SelectItem>
                <SelectItem value='DELIVERING'>Delivering</SelectItem>
                <SelectItem value='RECEIVED'>Received</SelectItem>
            </SelectContent>
        </Select>
    )
}