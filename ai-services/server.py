import grpc
from concurrent import futures
import time

import summarizer_pb2
import summarizer_pb2_grpc
from llm_client import generate_summary

class SummarizerServicer(summarizer_pb2_grpc.SummarizerServicer):
    def SummarizeTask(self, request, context):
        start_time = time.time()
        summary_text = generate_summary(request.content)
        processing_time_ms = (time.time() - start_time) * 1000

        return summarizer_pb2.SummarizeResponse(
            task_id=request.task_id,
            summary=summary_text,
            model_version="mock-llm-1.0",
            processing_time_ms=processing_time_ms
        )

    def StreamSummarizeTask(self, request, context):
        start_time = time.time()
        summary_text = generate_summary(request.content)
        
        # Split into words to simulate streaming
        words = summary_text.split()
        for i, word in enumerate(words):
            processing_time_ms = (time.time() - start_time) * 1000
            yield summarizer_pb2.SummarizeResponse(
                task_id=request.task_id,
                summary=word + (" " if i < len(words) - 1 else ""),
                model_version="mock-llm-1.0",
                processing_time_ms=processing_time_ms
            )
            time.sleep(0.05)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    summarizer_pb2_grpc.add_SummarizerServicer_to_server(SummarizerServicer(), server)
    server.add_insecure_port('[::]:50051')
    print("Starting AI Service on port 50051...")
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
