export interface IMessageConnection {
    status: 'connected' | 'connecting' | 'disconnected',
    adInfo: Map<String,String>
}