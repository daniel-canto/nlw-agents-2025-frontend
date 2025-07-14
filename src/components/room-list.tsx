import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { dayjs } from '@/utils/dayjs'
import { useRooms } from '@/http/use-rooms'

export function RoomList() {

    const { data, isLoading } = useRooms()

    return (
        <Card>
            <CardHeader>
            Salas recentes
            <CardDescription>
                Acesso rapido para as salas criadas criadas recentemente
            </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
            {isLoading && (
                <p className="text-muted-foreground text-sm">
                Carregando salas...
                </p>
            )}

            {data?.map((room) => {
                return (
                <Link className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50" key={room.id} to={`/room/${room.id}`}>
                    <div className="flex-1 flex flex-col gap-1">
                        <h3 className="font-medium">{room.name}</h3>
                        <div className="flex items-center gap-2">
                            <Badge className="text-xs" variant="secondary">{dayjs(room.createdAt).toNow()}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="text-xs" variant="secondary">{room.questionsCount} pergunta(s)</Badge>
                        </div>
                    </div>
                    <span className="flex items-center gap-1 text-small">
                        Entrar
                        <ArrowRight className="size-3"/>
                    </span>
                </Link>
                )
            })}
            </CardContent>
        </Card>
    )
}
